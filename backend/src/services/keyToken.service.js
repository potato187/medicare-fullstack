'use strict';
const { KeyTokenModel } = require('@/models');
const { convertToObjectIdMongodb } = require('@/utils');

class KeyTokenService {
	static async createPairToken(userId, publicKey, privateKey, refreshToken) {
		const id = convertToObjectIdMongodb(userId);
		const updateBody = { publicKey, privateKey, refreshToken, refreshTokenUsed: [] };
		const option = { upsert: true, new: true };

		const tokens = await KeyTokenModel.findByIdAndUpdate(id, updateBody, option);
		return tokens ? tokens.publicKey : null;
	}
}

module.exports = KeyTokenService;
