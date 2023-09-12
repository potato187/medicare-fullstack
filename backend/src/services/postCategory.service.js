const { NotFoundRequestError } = require('@/core');
const { _PostCategoryModel } = require('@/models');
const { UtilsRepo } = require('@/models/repository');
const { POST_CATEGORY_MODEL } = require('@/models/repository/constant');
const { getInfoData, convertToObjectIdMongodb } = require('@/utils');

class PostCategoryService {
	static async findByFilter({ filter = {}, select = ['_id'] }) {
		const result = await UtilsRepo.findOne({
			model: POST_CATEGORY_MODEL,
			filter,
			select,
		});
		return result;
	}

	static async getAll(parentId = null, depth = 0, select = []) {
		const filter = {
			parentId,
			isDeleted: false,
			display: true,
		};

		const results = await _PostCategoryModel.find(filter).sort({ index: 1 }).select(select).lean();

		const postCategories = await Promise.all(
			results.map(async (postCategory) => {
				const { _id, ...rest } = postCategory;
				rest.id = _id;
				rest.depth = depth;
				rest.collapsed = false;
				rest.children = await PostCategoryService.getAll(rest.id, depth + 1, select);
				return rest;
			}),
		);

		return postCategories;
	}

	static async checkExist(filter) {
		const result = await PostCategoryService.findByFilter({ filter });
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
		} else {
			category.index = index;
		}

		const newCategory = await UtilsRepo.createOne({
			model,
			body: category,
		});

		return getInfoData({
			fields: ['_id', 'parentId', 'name', 'slug'],
			object: newCategory,
		});
	}

	static async updateOneById({ id, updateBody }) {
		const select = Object.keys(updateBody);
		if (!select.length) return {};
		const filter = { _id: convertToObjectIdMongodb(id) };

		await PostCategoryService.checkExist(filter);

		return UtilsRepo.findOneAndUpdate({
			model: POST_CATEGORY_MODEL,
			filter,
			updateBody,
			select,
		});
	}

	static async deleteByIds(body) {
		const promises = body.map(({ id }) =>
			PostCategoryService.updateOneById({ id, updateBody: { isDeleted: true, display: false } }),
		);

		return Promise.all(promises);
	}

	static async sortable(body) {
		const updateOperations = body.map(({ id, ...updateBody }) => {
			return {
				filter: { _id: convertToObjectIdMongodb(id) },
				updateBody,
			};
		});

		updateOperations.forEach(async ({ filter, updateBody }) => {
			await UtilsRepo.findOneAndUpdate({
				model: POST_CATEGORY_MODEL,
				filter,
				updateBody,
				select: ['index', 'parentId'],
			});
		});

		return {};
	}
}

module.exports = PostCategoryService;
