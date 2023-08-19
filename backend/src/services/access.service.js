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
		const filter = { $or: [{ email }, { phone }] };
		const foundAdmin = await AdminRepo.findByFilter(filter);

		if (foundAdmin) {
			throw new ConflictRequestError('Phone or email already is use.');
		}

		return await AdminRepo.createAdmin({ firstName, lastName, email, phone, password, role, gender });
	}

	static async login({ email, password }) {
		const filter = { email };
		const select = ['_id', 'email', 'password', 'role', 'firstName', 'lastName'];
		const foundAdmin = await AdminRepo.findByFilter(filter, select);

		if (!foundAdmin) {
			throw new NotFoundRequestError();
		}

		if (!bcrypt.compareSync(password, foundAdmin.password)) {
			throw new UnauthorizedRequestError();
		}

		const [publicKey, privateKey] = [generateToken(), generateToken()];
		const payload = { userId: foundAdmin._id, role: foundAdmin.role };
		const tokens = await authUtils.createTokenPair(payload, publicKey, privateKey);

		await KeyTokenRepo.createPairToken(foundAdmin._id, publicKey, privateKey);

		return {
			admin: getInfoData({ fields: ['_id', 'email', 'firstName', 'lastName', 'role'], object: foundAdmin }),
			tokens,
		};
	}

	static async logout(keyStore) {
		return await KeyTokenRepo.removeById(keyStore._id);
	}

	static async handleRefreshToken({ user, keyStore, refreshToken }) {
		if (!keyStore || keyStore.refreshTokenUsed.includes(refreshToken)) {
			throw new ForbiddenRequestError('Something is wrong, pls login again');
		}

		await verifyToken(refreshToken, keyStore.privateKey);

		const tokens = await authUtils.createTokenPair(user, keyStore.publicKey, keyStore.privateKey);

		await KeyTokenRepo.markRefreshTokenUsed(keyStore._id, tokens.refreshToken, refreshToken);

		return {
			user,
			tokens,
		};
	}
}

module.exports = AccessService;
