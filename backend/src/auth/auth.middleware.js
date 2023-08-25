'use strict';
const { HEADERS } = require('@/constant');
const { UnauthorizedRequestError, ForbiddenRequestError } = require('@/core');
const { tryCatch } = require('@/middleware');
const { KeyTokenRepo } = require('@/models/repository');
const { convertToObjectIdMongodb } = require('@/utils');
const { verifyToken } = require('./auth.utils');

const checkRoles = (roles = []) => {
	return async (req, res, next) => {
		const { role } = req.user;
		const isValidRole = role && roles.includes(role);
		return isValidRole ? next() : next(new ForbiddenRequestError());
	};
};

const authorization = tryCatch(async (req, res, next) => {
	const clientId = req.headers[HEADERS.CLIENT_ID];
	const refreshToken = req.headers[HEADERS.REFRESH_TOKEN];
	const accessToken = req.headers[HEADERS.AUTHORIZATION]?.split(' ')[1];

	if (!clientId || !accessToken) {
		return next(new UnauthorizedRequestError({ code: 100401 }));
	}

	const filter = { userId: convertToObjectIdMongodb(clientId) };
	const select = ['publicKey', 'refreshTokenUsed'];
	const keyStore = await KeyTokenRepo.findByFilter(filter, select);

	if (!keyStore) {
		return next(new UnauthorizedRequestError({ code: 100401 }));
	}

	const { publicKey, refreshTokenUsed } = keyStore;

	try {
		const { userId, role } = await verifyToken(accessToken, publicKey);
		if (userId !== clientId) {
			return next(new UnauthorizedRequestError({ code: 100401 }));
		}

		req.user = { userId, role };
		req.keyStore = keyStore;

		return next();
	} catch (error) {
		if (error.name !== 'TokenExpiredError') {
			return next(new UnauthorizedRequestError({ code: 100401 }));
		}
	}

	if (refreshTokenUsed.includes(refreshToken)) {
		await KeyTokenRepo.removeById(keyStore._id);
		return next(new UnauthorizedRequestError({ code: 100401 }));
	}

	return next(new UnauthorizedRequestError({ code: 101401 }));
});

module.exports = {
	authorization,
	checkRoles,
};
