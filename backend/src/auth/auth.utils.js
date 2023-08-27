'use strict';
const JWT = require('jsonwebtoken');

const verifyToken = async (clientId, token, secretKey) => {
	let errorCode = 0;
	const payload = {};

	try {
		const decode = await JWT.verify(token, secretKey);

		if (decode.userId !== clientId) {
			errorCode = 100401;
		}

		payload.userId = decode.userId;
		payload.role = decode.role;
	} catch (error) {
		errorCode = error.name !== 'TokenExpiredError' ? 100401 : 101401;
	}

	if (errorCode === 101401) {
		const { userId, role } = JWT.decode(token);
		payload.userId = userId;
		payload.role = role;
	}

	return { payload, errorCode };
};

module.exports = {
	verifyToken,
};
