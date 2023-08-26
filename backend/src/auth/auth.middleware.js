'use strict';
const { HEADERS } = require('@/constant');
const { UnauthorizedRequestError, ForbiddenRequestError } = require('@/core');
const { tryCatch } = require('@/middleware');
const { KeyTokenRepo } = require('@/models/repository');
const { convertToObjectIdMongodb } = require('@/utils');
const { TokenBuilder } = require('@/services/builder');

const checkRoles = (roles = []) => {
	return async (req, res, next) => {
		const { role } = req.user;
		const isValidRole = role && roles.includes(role);
		return isValidRole ? next() : next(new ForbiddenRequestError());
	};
};

const authorization = tryCatch(async (req, res, next) => {
	const clientId = req.headers[HEADERS.CLIENT_ID];
	const accessToken = req.headers[HEADERS.AUTHORIZATION]?.split(' ')[1];

	if (!clientId || !accessToken) {
		return next(new UnauthorizedRequestError({ code: 100401 }));
	}

	const filter = { userId: convertToObjectIdMongodb(clientId) };
	const select = ['publicKey', 'refreshTokenUsed'];
	const keyStore = await KeyTokenRepo.findByFilter(filter, select);

	console.log(keyStore);

	if (!keyStore) {
		return next(new UnauthorizedRequestError({ code: 100401 }));
	}

	const accessTokenBuilder = new TokenBuilder()
		.setPayload({ userId: clientId })
		.setToken(accessToken)
		.setKey(keyStore.publicKey);

	const { payload, errorCode } = await accessTokenBuilder.verifyToken();

	if (errorCode) {
		const refreshToken = req.headers[HEADERS.REFRESH_TOKEN];
		if (keyStore.refreshTokenUsed.includes(refreshToken)) {
			await KeyTokenRepo.removeById(keyStore._id);
		}
		return next(new UnauthorizedRequestError({ code: errorCode }));
	}

	req.user = payload;
	req.keyStore = keyStore;
	return next();
});

module.exports = {
	authorization,
	checkRoles,
};
