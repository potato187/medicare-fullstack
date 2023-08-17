'use strict';
const { authUtils } = require('@/auth');
const {
	ConflictRequestError,
	NotFoundRequestError,
	UnauthorizedRequestError,
	ForbiddenRequestError,
} = require('@/core');
const { AdminModel } = require('@/models');
const { generateToken, getInfoData } = require('@/utils');
const bcrypt = require('bcrypt');
const KeyTokenService = require('./keyToken.service');
const AdminService = require('./admin.service');
const { verifyToken } = require('@/auth/auth.utils');
const workingHourModel = require('@/models/workingHour.model');

class AccessService {
	static async singUp({ firstName, lastName, email, password, role_key }) {
		const foundAdmin = await AdminService.findByFilter({ email });

		if (foundAdmin) {
			throw new ConflictRequestError();
		}

		return await AdminModel.create({ firstName, lastName, email, password, role_key });
	}

	static async login({ email, password }) {
		const foundAdmin = await AdminService.findByFilter({ email }, [
			'_id',
			'email',
			'password',
			'role_key',
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
			{ userId: foundAdmin._id, role: foundAdmin.role_key },
			publicKey,
			privateKey,
		);

		await KeyTokenService.createPairToken(foundAdmin._id, publicKey, privateKey);

		return {
			admin: getInfoData({ fields: ['_id', 'email', 'firstName', 'lastName', 'role_key'], object: foundAdmin }),
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
