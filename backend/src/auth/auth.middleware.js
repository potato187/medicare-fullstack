const { HEADERS } = require('@/constant');
const { UnauthorizedRequestError, ForbiddenRequestError } = require('@/core');
const { tryCatch } = require('@/middleware');
const { KeyTokenRepo } = require('@/models/repository');
const { convertToObjectIdMongodb } = require('@/utils');
const { verifyToken } = require('./auth.utils');

const checkRoles = (roles = []) => {
	return tryCatch(async (req, res, next) => {
		const { role } = req.user;
		const isValidRole = role && roles.includes(role);
		return isValidRole ? next() : next(new ForbiddenRequestError());
	});
};

const authorization = tryCatch(async (req, res, next) => {
	const clientId = req.headers[HEADERS.CLIENT_ID];
	const accessToken = req.headers[HEADERS.AUTHORIZATION]?.split(' ')[1];

	if (!clientId || !accessToken) {
		return next(new UnauthorizedRequestError({ code: 100401 }));
	}

	const filter = { userId: convertToObjectIdMongodb(clientId) };
	const keyStore = await KeyTokenRepo.findOne(filter, ['publicKey', 'refreshTokenUsed']);

	if (!keyStore) {
		return next(new UnauthorizedRequestError({ code: 100401 }));
	}

	const { payload, errorCode } = await verifyToken(clientId, accessToken, keyStore.publicKey);

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
