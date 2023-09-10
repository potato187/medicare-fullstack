const { _KeyTokenModel } = require('@/models');
const { convertToObjectIdMongodb, createSelectData } = require('@/utils');

class KeyTokenService {
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

	static async findByFilter(filter, select = ['_id']) {
		const result = await _KeyTokenModel.findOne(filter).select(createSelectData(select));
		return result;
	}

	static async removeById(id) {
		const result = _KeyTokenModel.deleteOne({ _id: convertToObjectIdMongodb(id) });
		return result;
	}

	static markRefreshTokenUsed = async (id, newRefreshToken, markRefreshToken) => {
		const result = await _KeyTokenModel.updateOne(
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

		return result;
	};
}

module.exports = KeyTokenService;
