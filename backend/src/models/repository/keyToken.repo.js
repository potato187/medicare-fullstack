const { createSelectData, convertToObjectIdMongodb } = require('@/utils');
const _KeyTokenModel = require('../keyToken.model');

class KeyTokenRepo {
	static async findOne(filter, select = ['_id']) {
		const _select = createSelectData(select);
		return _KeyTokenModel.findOne(filter).select(_select);
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

	static async removeByUserId(id) {
		return _KeyTokenModel.deleteOne({ userId: convertToObjectIdMongodb(id) });
	}

	static markRefreshTokenUsed = async (id, markRefreshToken) => {
		return _KeyTokenModel.updateOne(
			{ _id: convertToObjectIdMongodb(id) },
			{
				$addToSet: {
					refreshTokenUsed: markRefreshToken,
				},
			},
		);
	};
}

module.exports = KeyTokenRepo;
