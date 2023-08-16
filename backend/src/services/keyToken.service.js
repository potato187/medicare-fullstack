'use strict';
const { KeyTokenModel } = require('@/models');
const { convertToObjectIdMongodb } = require('@/utils');

class KeyTokenService {
	static async createPairToken(userId, publicKey, privateKey) {
		const filter = { userId: convertToObjectIdMongodb(userId) };
		const updateBody = {
			publicKey,
			privateKey,
			refreshTokenUsed: [],
		};
		const option = { upsert: true, new: true };

		const tokens = await KeyTokenModel.findOneAndUpdate(filter, updateBody, option);
		return tokens ? tokens.publicKey : null;
	}

	static async findByFilter(filter, select = ['_id']) {
		return await keyTokenModel.findOne(filter).select(createSelectData(select));
	}

	static async removeById(id) {
		return KeyTokenModel.deleteOne({ _id: convertToObjectIdMongodb(id) });
	}

	static markRefreshTokenUsed = async (id, newRefreshToken, markRefreshToken) => {
		return await KeyTokenModel.updateOne(
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

module.exports = KeyTokenService;
