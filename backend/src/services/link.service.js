const { UtilsRepo } = require('@/models/repository');
const { LINK_MODEL } = require('@/models/repository/constant');
const { getInfoData, convertToObjectIdMongodb } = require('@/utils');

class LinkService {
	static model = LINK_MODEL;

	static async createOne(body) {
		const newLink = await UtilsRepo.createOne(body);

		return getInfoData({
			model: LinkService.model,
			fields: [],
			object: newLink,
		});
	}

	static async updateOneById({ id, updateBody }) {
		const { model } = LinkService;

		const select = Object.keys(updateBody);
		if (!select.length) return {};

		await UtilsRepo.checkIsExist({
			model,
			filter: { _id: convertToObjectIdMongodb(id) },
		});

		return UtilsRepo.findOneAndUpdate({
			model,
			updateBody,
			select,
		});
	}

	static async deleteOneById(id) {
		return LinkService.updateOneById({
			id,
			updateBody: { isDeleted: true },
		});
	}
}

module.exports = LinkService;
