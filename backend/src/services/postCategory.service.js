const { NotFoundRequestError } = require('@/core');
const { UtilsRepo } = require('@/models/repository');
const { POST_CATEGORY_MODEL } = require('@/models/repository/constant');
const { getInfoData, convertToObjectIdMongodb, createSlug } = require('@/utils');

class PostCategoryService {
	static async findByFilter({ filter = {}, select = ['_id'] }) {
		const result = await UtilsRepo.findOne({
			model: POST_CATEGORY_MODEL,
			filter,
			select,
		});
		return result;
	}

	static async checkExist(filter) {
		const result = PostCategoryService.findByFilter({ filter });
		if (!result) {
			throw new NotFoundRequestError();
		}
		return true;
	}

	static async createOne(body) {
		const { index, ...category } = body;
		const model = POST_CATEGORY_MODEL;

		if (!index) {
			category.index = await UtilsRepo.countByFilter({ model });
		}

		const newCategory = await UtilsRepo.createOne({
			model,
			body: category,
		});

		return getInfoData({
			fields: ['_id', 'name', 'slug', 'description', 'banner'],
			object: newCategory,
		});
	}

	static async updateOneById({ id, updateBody }) {
		const { name, ...body } = updateBody;
		const select = Object.keys(updateBody);
		if (!select.length) return {};
		const slug = {};
		const filter = { _id: convertToObjectIdMongodb(id) };

		await PostCategoryService.checkExist(filter);

		if (name && name?.vi) {
			slug.vi = createSlug(name.vi);
		}

		if (name && name?.en) {
			slug.en = createSlug(name.en);
		}

		if (Object.keys(slug).length) {
			body.slug = slug;
		}

		const result = await UtilsRepo.findOneAndUpdate({
			model: POST_CATEGORY_MODEL,
			filter,
			updateBody: body,
			select,
		});

		return result;
	}

	static async deleteOneById(id) {
		const result = await PostCategoryService.updateById({
			id,
			updateBody: { isDeleted: true },
		});

		return result;
	}
}

module.exports = PostCategoryService;
