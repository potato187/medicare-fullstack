'use strict';
const { generateToken, getInfoData, convertToObjectIdMongodb } = require('@/utils');
const { KeyTokenRepo } = require('@/models/repository');
const { UnauthorizedRequestError, ConflictRequestError } = require('@/core');
const { AdminBuilder } = require('./builder');
const TokenBuilder = require('./builder/tokens.builder');

const ACCESS_TOKEN_EXPIRES = 10;
const REFRESH_TOKEN_EXPIRES = 10000;

class AccessService {
	static async singUp({ firstName, lastName, email, phone, password, role, gender }) {
		const adminBuilder = await new AdminBuilder()
			.setFirstName(firstName)
			.setLastName(lastName)
			.setEmail(email)
			.setPhone(phone)
			.setPassword(password)
			.setRole(role)
			.setGender(gender);

		const filter = { $or: [{ email }, { phone }] };
		if (await adminBuilder.find({ filter })) {
			throw new ConflictRequestError({ code: 200400 });
		}

		return await adminBuilder.insertAndSelect(['_id', 'email', 'firstName', 'lastName', 'role']);
	}

	static async login({ email, password }) {
		const adminBuilder = new AdminBuilder().setEmail(email).setPassword(password);

		const filter = { email };
		const select = ['_id', 'email', 'password', 'firstName', 'lastName', 'role'];
		const foundAdmin = await adminBuilder.find({ filter, select });

		if (!foundAdmin || !adminBuilder.comparePassword(foundAdmin.password)) {
			throw new UnauthorizedRequestError({ code: 200401 });
		}

		const [publicKey, privateKey] = [generateToken(), generateToken()];
		const payload = { userId: foundAdmin._id, role: foundAdmin.role };

		const accessToken = await new TokenBuilder()
			.setPayload(payload)
			.setKey(publicKey)
			.build({ expiresIn: ACCESS_TOKEN_EXPIRES });

		const refreshToken = await new TokenBuilder()
			.setPayload(payload)
			.setKey(privateKey)
			.build({ expiresIn: REFRESH_TOKEN_EXPIRES });

		await KeyTokenRepo.createPairToken(payload.userId, publicKey, privateKey);

		return {
			foundAdmin: getInfoData({ fields: ['_id', 'email', 'firstName', 'lastName', 'role'], object: foundAdmin }),
			tokens: {
				accessToken,
				refreshToken,
			},
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
			if (keyStore) {
				await KeyTokenRepo.removeById(keyStore._id);
			}
			throw new UnauthorizedRequestError();
		}

		const refreshTokenBuilder = new TokenBuilder()
			.setToken(refreshToken)
			.setKey(keyStore.privateKey)
			.setPayload({ userId: clientId });

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
