'use strict';
const JWT = require('jsonwebtoken');

const createTokenPair = async (payload, publicKey, privateKey) => {
	const accessToken = await JWT.sign(payload, publicKey, {
		expiresIn: '2d',
	});

	const refreshToken = await JWT.sign(payload, privateKey, {
		expiresIn: '7d',
	});

	return { accessToken, refreshToken };
};

const verifyToken = async (token, secretKey) => {
	return await JWT.verify(token, secretKey);
};

module.exports = {
	createTokenPair,
	verifyToken,
};
