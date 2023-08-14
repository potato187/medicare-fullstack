'use strict';
const { authUtils } = require('@/auth');
const { ConflictRequestError, NotFoundRequestError, UnauthorizedRequestError } = require('@/core');
const { AdminModel } = require('@/models');
const { findByFilter } = require('@/models/repository/admin.repo');
const { convertToObjectIdMongodb, generateToken } = require('@/utils');
const bcrypt = require('bcrypt');
const KeyTokenService = require('./keyToken.service');

class AccessService {
	static async singUp({ firstName, lastName, email, password, roleId }) {
		const foundAdmin = await findByFilter({ filter: { email } });

		if (foundAdmin) {
			throw new ConflictRequestError();
		}

		return await AdminModel.create({ firstName, lastName, email, password, roleId: convertToObjectIdMongodb(roleId) });
	}

	static async login({ email, password }) {
		const foundAdmin = await findByFilter({ filter: { email }, select: ['_id', 'firstName', 'lastName', 'password'] });

		if (!foundAdmin) {
			throw new NotFoundRequestError();
		}

		const match = bcrypt.compareSync(password, foundAdmin.password);

		if (!match) {
			throw new UnauthorizedRequestError();
		}

		const [publicKey, privateKey] = [generateToken(), generateToken()];
		const tokens = await authUtils.createTokenPair({ email }, publicKey, privateKey);
		await KeyTokenService.createPairToken(foundAdmin.id, publicKey, privateKey, tokens.refreshToken);

		return {
			admin: foundAdmin,
			tokens,
		};
	}
	static async logout() {}
	static async handleRefreshToken() {}
}

module.exports = AccessService;
