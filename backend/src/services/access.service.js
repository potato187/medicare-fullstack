'use strict';
const { authUtils } = require('@/auth');
const { verifyToken } = require('@/auth/auth.utils');
const { generateToken, getInfoData } = require('@/utils');
const bcrypt = require('bcrypt');
const KeyTokenService = require('./keyToken.service');
const {
	ConflictRequestError,
	NotFoundRequestError,
	UnauthorizedRequestError,
	ForbiddenRequestError,
} = require('@/core');
const { AdminRepo } = require('@/models/repository');

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
		const foundAdmin = await AdminRepo.findByFilter({ email }, [
			'_id',
			'email',
			'password',
			'role',
			'firstName',
			'lastName',
		]);

		if (!foundAdmin) {
			throw new NotFoundRequestError();
		}

		const match = bcrypt.compareSync(password, foundAdmin.password);

		if (!match) {
			throw new UnauthorizedRequestError();
		}

		const [publicKey, privateKey] = [generateToken(), generateToken()];
		const tokens = await authUtils.createTokenPair(
			{ userId: foundAdmin._id, role: foundAdmin.role },
			publicKey,
			privateKey,
		);

		await KeyTokenService.createPairToken(foundAdmin._id, publicKey, privateKey);

		return {
			admin: getInfoData({ fields: ['_id', 'email', 'firstName', 'lastName', 'role'], object: foundAdmin }),
			tokens,
		};
	}

	static async logout(keyStore) {
		return await KeyTokenService.removeById(keyStore._id);
	}

	static async handleRefreshToken({ user, keyStore, refreshToken }) {
		if (!keyStore || keyStore.refreshTokenUsed.includes(refreshToken)) {
			throw new ForbiddenRequestError('Something is wrong, pls login again');
		}

		await verifyToken(refreshToken, keyStore.privateKey);

		const tokens = await authUtils.createTokenPair(user, keyStore.publicKey, keyStore.privateKey);

		await KeyTokenService.markRefreshTokenUsed(keyStore._id, tokens.refreshToken, refreshToken);

		return {
			user,
			tokens,
		};
	}
}

module.exports = AccessService;
