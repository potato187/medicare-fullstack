'use strict';
const { authUtils } = require('@/auth');
const {
	ConflictRequestError,
	NotFoundRequestError,
	UnauthorizedRequestError,
	ForbiddenRequestError,
} = require('@/core');
const { AdminModel } = require('@/models');
const { convertToObjectIdMongodb, generateToken, getInfoData } = require('@/utils');
const bcrypt = require('bcrypt');
const KeyTokenService = require('./keyToken.service');
const AdminService = require('./admin.service');
const { RoleRepo } = require('@/models/repository');
const { verifyToken } = require('@/auth/auth.utils');

class AccessService {
	static async singUp({ firstName, lastName, email, password, roleId }) {
		const foundAdmin = await AdminService.findByFilter({ email });

		if (foundAdmin) {
			throw new ConflictRequestError();
		}

		return await AdminModel.create({ firstName, lastName, email, password, roleId });
	}

	static async login({ email, password }) {
		const foundAdmin = await AdminService.findByFilter({ email }, [
			'_id',
			'email',
			'password',
			'roleId',
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
			{ userId: foundAdmin._id, roleId: foundAdmin.roleId },
			publicKey,
			privateKey,
		);

		await KeyTokenService.createPairToken(foundAdmin._id, publicKey, privateKey);

		return {
			admin: getInfoData({ fields: ['_id', 'email', 'firstName', 'lastName', 'roleId'], object: foundAdmin }),
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

		const [publicKey, privateKey] = [generateToken(), generateToken()];
		const tokens = await authUtils.createTokenPair(user, publicKey, privateKey);

		await KeyTokenService.markRefreshTokenUsed(keyStore._id, tokens.refreshToken, refreshToken);

		return {
			user,
			tokens,
		};
	}
}

module.exports = AccessService;
