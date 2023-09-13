const { NotFoundRequestError } = require('@/core');
const { UtilsRepo } = require('@/models/repository');
const { BLOG_MODEL } = require('@/models/repository/constant');
const { getInfoData, convertToObjectIdMongodb } = require('@/utils');

class BlogService {
	static model = BLOG_MODEL;

	static async findByFilter({ filter = {}, select = ['_id'] }) {
		const result = await UtilsRepo.findOne({
			model: BlogService.model,
			filter,
			select,
		});
		return result;
	}

	static async checkExist(filter) {
		const result = await BlogService.findByFilter({ filter });
		if (!result) {
			throw new NotFoundRequestError();
		}
		return true;
	}

	static async createOne(body) {
		const newCategory = await UtilsRepo.createOne({
			model: BlogService.model,
			body,
		});

		return getInfoData({
			fields: ['_id'],
			object: newCategory,
		});
	}

	static async updateOneById({ id, updateBody }) {
		const select = Object.keys(updateBody);
		if (!select.length) return {};
		const filter = { _id: convertToObjectIdMongodb(id), isDeleted: false };

		await BlogService.checkExist(filter);

		return UtilsRepo.findOneAndUpdate({
			model: BlogService.model,
			filter,
			updateBody,
			select,
		});
	}

	static async deleteOneById(id) {
		return BlogService.updateOneById({ id, updateBody: { isDeleted: true, isDisplay: false } });
	}

	static async queryByParams() {
		return [];
	}

	static getOneById({ id, select }) {
		return BlogService.findByFilter({ filter: { _id: convertToObjectIdMongodb(id) }, select });
	}
}

module.exports = BlogService;
