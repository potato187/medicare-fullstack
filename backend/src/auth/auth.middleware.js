const { HEADERS } = require('@/constant');
const { UnauthorizedRequestError, ForbiddenRequestError } = require('@/core');
const { tryCatch } = require('@/middleware');
const { KeyTokenRepo } = require('@/models/repository');
const { convertToObjectIdMongodb } = require('@/utils');
const { verifyToken } = require('./auth.utils');

const checkRoles = (roles = []) => {
	return tryCatch(async (req, _, next) => {
		const { role } = req.user;
		const isValidRole = role && roles.includes(role);

		if (!isValidRole) {
			throw new ForbiddenRequestError();
		}

		next();
	});
};

const authorization = tryCatch(async (req, _, next) => {
	const clientId = req.headers[HEADERS.CLIENT_ID];
	const accessToken = req.headers[HEADERS.AUTHORIZATION]?.split(' ')[1];

	if (!clientId || !accessToken) {
		throw new UnauthorizedRequestError({ code: 100401 })();
	}

	const filter = { userId: convertToObjectIdMongodb(clientId) };
	const keyStore = await KeyTokenRepo.findOne(filter, ['publicKey', 'refreshTokenUsed']);

	if (!keyStore) {
		throw new UnauthorizedRequestError({ code: 100401 });
	}

	const { payload, errorCode } = await verifyToken(clientId, accessToken, keyStore.publicKey);

	if (errorCode) {
		const refreshToken = req.headers[HEADERS.REFRESH_TOKEN];
		if (keyStore.refreshTokenUsed.includes(refreshToken)) {
			await KeyTokenRepo.removeById(keyStore._id);
		}

		throw new UnauthorizedRequestError({ code: errorCode });
	}

	req.user = payload;
	req.keyStore = keyStore;

	next();
});

module.exports = {
	authorization,
	checkRoles,
};
