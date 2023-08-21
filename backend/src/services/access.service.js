'use strict';
const { authUtils } = require('@/auth');
const { verifyToken } = require('@/auth/auth.utils');
const { generateToken, getInfoData } = require('@/utils');
const bcrypt = require('bcrypt');
const { AdminRepo, KeyTokenRepo } = require('@/models/repository');

const {
	ConflictRequestError,
	NotFoundRequestError,
	UnauthorizedRequestError,
	ForbiddenRequestError,
} = require('@/core');

class AccessService {
	static async singUp({ firstName, lastName, email, phone, password, role, gender }) {
		const adminExist = await AdminRepo.findByFilter({ $or: [{ email }, { phone }] });

		if (adminExist) {
			throw new ConflictRequestError({ code: 200400 });
		}

		const newAdmin = await AdminRepo.createAdmin({ firstName, lastName, email, phone, password, role, gender });

		return getInfoData({
			fields: ['_id', 'firstName', 'lastName', 'email', 'phone', 'role', 'gender'],
			object: newAdmin,
		});
	}

	static async login({ email, password }) {
		const filter = { email };
		const select = ['_id', 'email', 'password', 'role', 'firstName', 'lastName'];
		const admin = await AdminRepo.findByFilter(filter, select);

		if (!admin) {
			throw new NotFoundRequestError({ code: 200404 });
		}

		if (!bcrypt.compareSync(password, admin.password)) {
			throw new UnauthorizedRequestError({ code: 200401 });
		}

		const [publicKey, privateKey] = [generateToken(), generateToken()];
		const payload = { userId: admin._id, role: admin.role };
		const tokens = await authUtils.createTokenPair(payload, publicKey, privateKey);

		await KeyTokenRepo.createPairToken(admin._id, publicKey, privateKey);

		return {
			admin: getInfoData({ fields: ['_id', 'email', 'firstName', 'lastName', 'role'], object: admin }),
			tokens,
		};
	}

	static async logout(keyStore) {
		return await KeyTokenRepo.removeById(keyStore._id);
	}
}

module.exports = AccessService;
