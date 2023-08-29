'use strict';
const { generateToken, getInfoData, convertToObjectIdMongodb } = require('@/utils');
const { KeyTokenRepo, UtilsRepo } = require('@/models/repository');
const { UnauthorizedRequestError, ConflictRequestError } = require('@/core');
const { AdminBuilder } = require('./builder');
const TokenBuilder = require('./builder/_tokens.builder');
const { ADMIN_MODEL, KEY_TOKEN_MODEL } = require('@/models/repository/constant');
const { authUtils } = require('@/auth');

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
		const accountBuilder = new AdminBuilder().setEmail(email).setPassword(password);

		const account = await UtilsRepo.findOne({
			model: ADMIN_MODEL,
			filter: { email },
			select: ['_id', 'email', 'password', 'firstName', 'lastName', 'role'],
		});

		if (!account || !accountBuilder.comparePassword(account.password)) {
			throw new UnauthorizedRequestError({ code: 200401 });
		}

		const payload = { userId: account._id, role: account.role };
		const accessTokenBuilder = new TokenBuilder().setPayload(payload).setKey(generateToken());
		const refreshTokenBuilder = new TokenBuilder().setPayload(payload).setKey(generateToken());

		await KeyTokenRepo.createPairToken(payload.userId, accessTokenBuilder.getKey(), refreshTokenBuilder.getKey());

		return {
			account: getInfoData({ fields: ['_id', 'email', 'firstName', 'lastName', 'role'], object: account }),
			tokens: {
				accessToken: await accessTokenBuilder.buildAccessToken(),
				refreshToken: await refreshTokenBuilder.buildRefreshToken(),
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
