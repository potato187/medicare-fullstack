'use strict';
const { HEADERS } = require('@/constant');
const { BadRequestError, UnauthorizedRequestError, ForbiddenRequestError } = require('@/core');
const { tryCatch } = require('@/middleware');
const { KeyTokenRepo } = require('@/models/repository');
const { convertToObjectIdMongodb } = require('@/utils');
const { verifyToken } = require('./auth.utils');

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
	if (!clientId) {
		return next(new BadRequestError());
	}

	const filter = { userId: convertToObjectIdMongodb(clientId) };
	const select = ['publicKey', 'privateKey', 'refreshToken', 'refreshTokenUsed'];
	const keyStore = await KeyTokenRepo.findByFilter(filter, select);

	if (!keyStore) {
		return next(new BadRequestError());
	}

	const accessToken = req.headers[HEADERS.AUTHORIZATION].split(' ')[1];

	if (!accessToken) {
		return next(new UnauthorizedRequestError({ code: 102401 }));
	}

	try {
		const { userId, role } = await verifyToken(accessToken, keyStore.publicKey);
		if (userId !== clientId) {
			return next(new BadRequestError());
		}
		req.user = { userId, role };
		req.keyStore = keyStore;
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return next(new UnauthorizedRequestError({ code: 101401 }));
		}
		return next(new UnauthorizedRequestError({ code: 102401 }));
	}

	return next();
});

module.exports = {
	checkRoles,
	authorization,
};
