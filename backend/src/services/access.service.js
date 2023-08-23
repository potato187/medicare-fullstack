'use strict';
const { authUtils } = require('@/auth');
const { verifyToken, createAccessToken, createTokenPair } = require('@/auth/auth.utils');
const { generateToken, getInfoData, convertToObjectIdMongodb } = require('@/utils');
const bcrypt = require('bcrypt');
const { AdminRepo, KeyTokenRepo } = require('@/models/repository');

const { ConflictRequestError, NotFoundRequestError, UnauthorizedRequestError } = require('@/core');
const { decode } = require('jsonwebtoken');

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

	static async refreshTokens({ clientId, refreshToken }) {
		const filter = { userId: convertToObjectIdMongodb(clientId) };
		const select = ['_id', 'refreshTokenUsed', 'publicKey', 'privateKey'];
		const keyStore = await KeyTokenRepo.findByFilter(filter, select);

		if (!keyStore || keyStore.refreshTokenUsed.includes(refreshToken)) {
			await KeyTokenRepo.removeById(keyStore._id);
			throw new UnauthorizedRequestError();
		}

		try {
			const { userId, role } = await verifyToken(refreshToken, keyStore.privateKey);
			const accessToken = await createAccessToken({ userId, role }, keyStore.publicKey);

			return { accessToken, refreshToken };
		} catch (error) {
			if (error.name !== 'TokenExpiredError') {
				throw new UnauthorizedRequestError();
			}
		}

		await KeyTokenRepo.markRefreshTokenUsed(keyStore._id, refreshToken);
		const { userId, role } = decode(refreshToken);
		return await createTokenPair({ userId, role }, keyStore.publicKey, keyStore.privateKey);
	}
}

module.exports = AccessService;
