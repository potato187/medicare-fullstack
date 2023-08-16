'use strict';
const { authUtils } = require('@/auth');
const { ConflictRequestError, NotFoundRequestError, UnauthorizedRequestError, BadRequestError } = require('@/core');
const { AdminModel } = require('@/models');
const { convertToObjectIdMongodb, generateToken, getInfoData } = require('@/utils');
const bcrypt = require('bcrypt');
const KeyTokenService = require('./keyToken.service');
const AdminService = require('./admin.service');
const { getPermissionsById } = require('@/models/repository/role.repo');
const { RoleRepo } = require('@/models/repository');

class AccessService {
	static async singUp({ firstName, lastName, email, password, roleId }) {
		const foundAdmin = await AdminService.findByFilter({ email });

		if (foundAdmin) {
			throw new ConflictRequestError();
		}

		return await AdminModel.create({ firstName, lastName, email, password, roleId: convertToObjectIdMongodb(roleId) });
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

		const { permissions } = await RoleRepo.getPermissionsById(foundAdmin.roleId);

		const [publicKey, privateKey] = [generateToken(), generateToken()];
		const tokens = await authUtils.createTokenPair(
			{ userId: foundAdmin._id, email: foundAdmin.email, permissions },
			publicKey,
			privateKey,
		);
		await KeyTokenService.createPairToken(foundAdmin._id, publicKey, privateKey, tokens.refreshToken);

		return {
			admin: getInfoData({ fields: ['_id', 'email', 'firstName', 'lastName'], object: foundAdmin }),
			tokens,
		};
	}

	static async logout(keyStore) {
		return await KeyTokenService.removeById(keyStore._id);
	}

	static async handleRefreshToken() {}
}

module.exports = AccessService;
