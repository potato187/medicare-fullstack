'use strict';
const { NotFoundRequestError } = require('@/core');
const { _PostCategoryModel } = require('@/models');
const { UtilsRepo } = require('@/models/repository');
const { POST_CATEGORY_MODEL } = require('@/models/repository/constant');
const { getInfoData, convertToObjectIdMongodb, createSlug } = require('@/utils');

class PostCategoryService {
	static async findByFilter({ filter = {}, select = ['_id'] }) {
		return await UtilsRepo.findOne({
			model: POST_CATEGORY_MODEL,
			filter,
			select,
		});
	}

	static async checkExist(filter) {
		const result = PostCategoryService.findByFilter({ filter });
		if (!result) {
			throw new NotFoundRequestError();
		}
		return true;
	}

	static async create(body) {
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

	static async updateById({ id, updateBody }) {
		const select = Object.keys(updateBody);
		if (!select.length) return {};
		const slug = {};
		const filter = { _id: convertToObjectIdMongodb(id) };

		await PostCategoryService.checkExist(filter);

		if (updateBody.name?.vi) {
			slug.vi = createSlug(updateBody.name.vi);
		}

		if (updateBody.name?.en) {
			slug.en = createSlug(updateBody.name.en);
		}

		if (Object.keys(slug).length) {
			updateBody.slug = slug;
		}

		return await UtilsRepo.findOneAndUpdate({
			model: POST_CATEGORY_MODEL,
			filter,
			updateBody,
			select,
		});
	}

	static async deleteById(id) {
		return await PostCategoryService.updateById({
			id,
			updateBody: { isDeleted: true },
		});
	}
}

module.exports = PostCategoryService;
