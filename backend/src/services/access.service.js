const bcrypt = require('bcrypt');
const { generateToken, getInfoData, convertToObjectIdMongodb } = require('@/utils');
const { KeyTokenRepo, UtilsRepo } = require('@/models/repository');
const { UnauthorizedRequestError } = require('@/core');
const { ADMIN_MODEL, KEY_TOKEN_MODEL } = require('@/models/repository/constant');
const { authUtils } = require('@/auth');
const TokenBuilder = require('./builder/_tokens.builder');

class AccessService {
	static model = ADMIN_MODEL;

	static async singUp(body) {
		const { email, phone } = body;

		await UtilsRepo.checkConflicted({
			model: AccessService.model,
			filter: { $or: [{ email }, { phone }] },
			code: 200400,
		});

		const newUser = await UtilsRepo.createOne({
			model: AccessService.model,
			body,
		});

		return getInfoData({
			fields: ['_id', 'email', 'firstName', 'lastName', 'role', 'phone'],
			object: newUser,
		});
	}

	static async login({ email, password }) {
		const foundAdmin = await UtilsRepo.findOne({
			model: AccessService.model,
			filter: { email, isDeleted: false, isActive: 'active' },
			select: ['_id', 'email', 'password', 'firstName', 'lastName', 'role'],
		});

		if (!foundAdmin || !bcrypt.compareSync(password, foundAdmin.password)) {
			throw new UnauthorizedRequestError({ code: 201400 });
		}

		const payload = { userId: foundAdmin._id, role: foundAdmin.role };
		const accessTokenBuilder = new TokenBuilder().setPayload(payload).setKey(generateToken());
		const refreshTokenBuilder = new TokenBuilder().setPayload(payload).setKey(generateToken());

		await KeyTokenRepo.createPairToken(payload.userId, accessTokenBuilder.getKey(), refreshTokenBuilder.getKey());

		return {
			account: getInfoData({ fields: ['_id', 'email', 'firstName', 'lastName', 'phone', 'role'], object: foundAdmin }),
			tokens: {
				accessToken: await accessTokenBuilder.buildAccessToken(),
				refreshToken: await refreshTokenBuilder.buildRefreshToken(),
			},
		};
	}

	static async logout(keyStore) {
		const result = await UtilsRepo.removeById({
			model: KEY_TOKEN_MODEL,
			id: keyStore._id,
		});

		return result;
	}

	static async refreshTokens({ clientId, refreshToken }) {
		const keyStore = await UtilsRepo.findOne({
			model: KEY_TOKEN_MODEL,
			filter: { userId: convertToObjectIdMongodb(clientId) },
			select: ['_id', 'refreshTokenUsed', 'publicKey', 'privateKey'],
		});

		if (!keyStore || keyStore.refreshTokenUsed.includes(refreshToken)) {
			if (keyStore) {
				await UtilsRepo.removeById({
					model: KEY_TOKEN_MODEL,
					id: keyStore._id,
				});
			}
			throw new UnauthorizedRequestError();
		}

		const { payload, errorCode } = await authUtils.verifyToken(clientId, refreshToken, keyStore.privateKey);
		const refreshTokenBuilder = new TokenBuilder().setPayload(payload).setKey(keyStore.privateKey);
		const accessTokenBuilder = new TokenBuilder().setPayload(payload).setKey(keyStore.publicKey);

		if (errorCode === 100401) {
			throw new UnauthorizedRequestError();
		}

		if (!errorCode) {
			return {
				accessToken: await accessTokenBuilder.buildAccessToken(),
				refreshToken,
			};
		}

		await KeyTokenRepo.markRefreshTokenUsed(keyStore._id, refreshToken);

		return {
			accessToken: await accessTokenBuilder.buildAccessToken(),
			refreshToken: await refreshTokenBuilder.buildRefreshToken(),
		};
	}
}

module.exports = AccessService;
