'use strict';
const { HEADERS } = require('@/constant');
const { BadRequestError, UnauthorizedRequestError } = require('@/core');
const { convertToObjectIdMongodb } = require('@/utils');
const { verifyToken } = require('./auth.utils');
const { KeyTokenRepo } = require('@/models/repository');

const checkRoles = (roles = []) => {
	return async (req, res, next) => {
		const { role } = req.user;
		if (!roleId || !roles.includes(role)) {
			return next(new UnauthorizedRequestError('Permission denied.'));
		}

		return next();
	};
};

const authorization = async (req, res, next) => {
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

	const accessToken = req.headers[HEADERS.AUTHORIZATION];

	console.log(accessToken);

	if (!accessToken) {
		return next(new UnauthorizedRequestError());
	}

	const { userId, role } = await verifyToken(accessToken, keyStore.publicKey);

	if (userId !== clientId) {
		return next(new UnauthorizedRequestError());
	}

	req.user = { userId, role };
	req.keyStore = keyStore;

	return next();
};

module.exports = {
	checkRoles,
	authorization,
};
