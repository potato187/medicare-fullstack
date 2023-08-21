'use strict';
const { HEADERS } = require('@/constant');
const { BadRequestError, UnauthorizedRequestError, ForbiddenRequestError } = require('@/core');
const { tryCatch } = require('@/middleware');
const { KeyTokenRepo } = require('@/models/repository');
const { convertToObjectIdMongodb } = require('@/utils');
const { verifyToken, createAccessToken, createTokenPair } = require('./auth.utils');
const { decode } = require('jsonwebtoken');

const checkRoles = (roles = []) => {
	return async (req, res, next) => {
		const { role } = req.user;
		if (!role || !roles.includes(role)) {
			return next(new ForbiddenRequestError());
		}

		return next();
	};
};

const authorization = tryCatch(async (req, res, next) => {
	const clientId = req.headers[HEADERS.CLIENT_ID];
	const refreshToken = req.headers[HEADERS.REFRESH_TOKEN];
	const accessToken = req.headers[HEADERS.AUTHORIZATION]?.split(' ')[1];

	if (!clientId || !accessToken) {
		return next(new UnauthorizedRequestError({ code: 102401 }));
	}

	const filter = { userId: convertToObjectIdMongodb(clientId) };
	const select = ['publicKey', 'privateKey', 'refreshTokenUsed'];
	const keyStore = await KeyTokenRepo.findByFilter(filter, select);

	if (!keyStore) {
		return next(new BadRequestError());
	}

	try {
		const { userId, role } = await verifyToken(accessToken, keyStore.publicKey);
		if (userId !== clientId) {
			return next(new UnauthorizedRequestError());
		}

		req.user = { userId, role };
		req.keyStore = keyStore;

		return next();
	} catch (error) {
		console.log(error);
		if (error.name !== 'TokenExpiredError') {
			return next(new UnauthorizedRequestError({ code: 101401 }));
		}
	}

	if (keyStore.refreshTokenUsed.includes(refreshToken)) {
		await KeyTokenRepo.removeById(keyStore._id);
		return next(new UnauthorizedRequestError());
	}

	try {
		const { userId, role } = await verifyToken(refreshToken, keyStore.privateKey);
		if (userId !== clientId) {
			return next(new UnauthorizedRequestError());
		}

		const newAccessToken = await createAccessToken({ userId, role }, keyStore.publicKey);

		req.user = { userId, role };
		req.keyStore = keyStore;
		req.tokens = {
			accessToken: newAccessToken,
			refreshToken,
		};

		return next();
	} catch (error) {
		if (error.name !== 'TokenExpiredError') {
			return next(new UnauthorizedRequestError({ code: 101401 }));
		}
	}

	const { userId, role } = decode(refreshToken);
	await KeyTokenRepo.markRefreshTokenUsed(keyStore._id, refreshToken);
	const tokens = await createTokenPair({ userId, role }, keyStore.publicKey, keyStore.privateKey);

	req.tokens = { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
	req.keyStore = keyStore;
	req.user = { userId, role };

	return next();
});

module.exports = {
	checkRoles,
	authorization,
};
