'use strict';
const { generateToken, getInfoData, convertToObjectIdMongodb } = require('@/utils');
const { KeyTokenRepo, UtilsRepo } = require('@/models/repository');
const { UnauthorizedRequestError, ConflictRequestError } = require('@/core');
const { AdminBuilder } = require('./builder');
const TokenBuilder = require('./builder/tokens.builder');
const { ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } = require('@/auth/auth.constant');
const { ADMIN_MODEL, KEY_TOKEN_MODEL } = require('@/models/repository/constant');

class AccessService {
	static async singUp({ firstName, lastName, email, phone, password, role, gender }) {
		const admin = await new AdminBuilder()
			.setFirstName(firstName)
			.setLastName(lastName)
			.setEmail(email)
			.setPhone(phone)
			.setPassword(password)
			.setRole(role)
			.setGender(gender)
			.build();

		const adminFound = await UtilsRepo.findOne({
			model: ADMIN_MODEL,
			filter: { $or: [{ email }, { phone }] },
		});

		if (adminFound) {
			throw new ConflictRequestError({ code: 200400 });
		}

		const newUser = new UtilsRepo.createOne({
			model: ADMIN_MODEL,
			body: admin,
		});

		return getInfoData({
			fields: ['_id', 'email', 'firstName', 'lastName', 'role'],
			object: newUser,
		});
	}

	static async login({ email, password }) {
		const adminBuilder = new AdminBuilder().setEmail(email).setPassword(password);

		const foundAdmin = await UtilsRepo.findOne({
			model: ADMIN_MODEL,
			filter: { email },
			select: ['_id', 'email', 'password', 'firstName', 'lastName', 'role'],
		});

		if (!foundAdmin || !adminBuilder.comparePassword(foundAdmin.password)) {
			throw new UnauthorizedRequestError({ code: 200401 });
		}

		const payload = { userId: foundAdmin._id, role: foundAdmin.role };
		const accessTokenBuilder = new TokenBuilder().setPayload(payload).setKey(generateToken());
		const refreshTokenBuilder = new TokenBuilder().setPayload(payload).setKey(generateToken());

		await KeyTokenRepo.createPairToken(payload.userId, accessTokenBuilder.getKey(), refreshTokenBuilder.getKey());

		return {
			foundAdmin: getInfoData({ fields: ['_id', 'email', 'firstName', 'lastName', 'role'], object: foundAdmin }),
			tokens: {
				accessToken: await accessTokenBuilder.build(),
				refreshToken: await refreshTokenBuilder.build(),
			},
		};
	}

	static async logout(keyStore) {
		return await UtilsRepo.removeById({
			model: KEY_TOKEN_MODEL,
			id: keyStore._id,
		});
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

		const refreshTokenBuilder = new TokenBuilder()
			.setKey(keyStore.privateKey)
			.setPayload({ userId: clientId })
			.setToken(refreshToken);

		const { payload, errorCode } = await refreshTokenBuilder.verifyToken();
		const accessTokenBuilder = new TokenBuilder().setKey(keyStore.publicKey).setPayload(payload);

		if (errorCode === 100401) {
			throw new UnauthorizedRequestError();
		}

		if (!errorCode) {
			return {
				accessToken: await accessTokenBuilder.build({ expiresIn: ACCESS_TOKEN_EXPIRES }),
				refreshToken: refreshTokenBuilder.getToken(),
			};
		}

		await KeyTokenRepo.markRefreshTokenUsed(keyStore._id, refreshTokenBuilder.getToken());

		return {
			accessToken: await accessTokenBuilder.build({ expiresIn: ACCESS_TOKEN_EXPIRES }),
			refreshToken: await refreshTokenBuilder.build({ expiresIn: REFRESH_TOKEN_EXPIRES }),
		};
	}
}

module.exports = AccessService;
