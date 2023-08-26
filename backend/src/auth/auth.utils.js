'use strict';
const JWT = require('jsonwebtoken');

const createAccessToken = async (payload, publicKey) => {
	return await JWT.sign(payload, publicKey, {
		expiresIn: '3 days',
	});
};

const createTokenPair = async (payload, publicKey, privateKey) => {
	const accessToken = await JWT.sign(payload, publicKey, {
		expiresIn: '3 days',
	});

	const refreshToken = await JWT.sign(payload, privateKey, {
		expiresIn: '30 days',
	});

	return { accessToken, refreshToken };
};

const verifyToken = async (token, secretKey) => {
	return await JWT.verify(token, secretKey);
};

module.exports = {
	createAccessToken,
	createTokenPair,
	verifyToken,
};
