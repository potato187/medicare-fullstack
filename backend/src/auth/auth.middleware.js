'use strict';
const { HEADERS } = require('@/constant');
const { BadRequestError, UnauthorizedRequestError } = require('@/core');
const { convertToObjectIdMongodb } = require('@/utils');
const { verifyToken } = require('./auth.utils');
const { findByFilter } = require('@/models/repository/keyToken.repo');
const { KeyTokenRepo } = require('@/models/repository');

const permission = (permission = []) => {
	return async (req, res, next) => {
		const userPermission = req.user.permissions;
		if (
			!userPermission ||
			!Array.isArray(userPermission) ||
			!userPermission.length ||
			!permission.every((key) => userPermission.includes(key))
		) {
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
	const select = ['publicKey', 'privateKey', 'refreshToken'];
	const keyStore = await KeyTokenRepo.findByFilter(filter, select);

	if (!keyStore) {
		return next(new BadRequestError());
	}

	const refreshToken = req.headers[HEADERS.REFRESH_TOKEN];
	if (refreshToken) {
		const { email, userId, permissions } = await verifyToken(refreshToken, keyStore.privateKey);
		if (payload.userId !== clientId) {
			return next(new UnauthorizedRequestError());
		}

		req.user = { email, userId, permissions };
		req.refreshToken = refreshToken;
		req.keyStore = keyStore;
		return next();
	}

	const accessToken = req.headers[HEADERS.AUTHORIZATION];

	if (!accessToken) {
		return next(new UnauthorizedRequestError());
	}

	const { email, userId, permissions } = await verifyToken(accessToken, keyStore.publicKey);

	if (userId !== clientId) {
		return next(new UnauthorizedRequestError());
	}

	req.user = { email, userId, permissions };
	req.keyStore = keyStore;

	return next();
};

module.exports = {
	permission,
	authorization,
};
