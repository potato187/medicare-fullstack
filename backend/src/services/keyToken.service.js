'use strict';
const { KeyTokenModel } = require('@/models');
const { convertToObjectIdMongodb } = require('@/utils');

class KeyTokenService {
	static async createPairToken(userId, publicKey, privateKey, refreshToken) {
		const filter = { userId: convertToObjectIdMongodb(userId) };
		const updateBody = {
			publicKey,
			privateKey,
			refreshToken,
			refreshTokenUsed: [],
		};
		const option = { upsert: true, new: true };

		const tokens = await KeyTokenModel.findOneAndUpdate(filter, updateBody, option);
		return tokens ? tokens.publicKey : null;
	}

	static async removeById(id) {
		return KeyTokenModel.deleteOne({ _id: convertToObjectIdMongodb(id) });
	}
}

module.exports = KeyTokenService;
