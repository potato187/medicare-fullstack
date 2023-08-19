'use strict';
const { createSelectData, convertToObjectIdMongodb } = require('@/utils');
const _KeyTokenModel = require('../keyToken.model');

class KeyTokenRepo {
	static async findByFilter(filter, select = ['_id']) {
		return await _KeyTokenModel.findOne(filter).select(createSelectData(select));
	}

	static async createPairToken(userId, publicKey, privateKey) {
		const filter = { userId: convertToObjectIdMongodb(userId) };
		const updateBody = {
			publicKey,
			privateKey,
			refreshTokenUsed: [],
		};
		const option = { upsert: true, new: true };

		const tokens = await _KeyTokenModel.findOneAndUpdate(filter, updateBody, option);
		return tokens ? tokens.publicKey : null;
	}

	static async removeById(id) {
		return _KeyTokenModel.deleteOne({ _id: convertToObjectIdMongodb(id) });
	}

	static markRefreshTokenUsed = async (id, newRefreshToken, markRefreshToken) => {
		return await _KeyTokenModel.updateOne(
			{ _id: convertToObjectIdMongodb(id) },
			{
				$set: {
					refreshToken: newRefreshToken,
				},
				$addToSet: {
					refreshTokenUsed: markRefreshToken,
				},
			},
		);
	};
}

module.exports = KeyTokenRepo;
