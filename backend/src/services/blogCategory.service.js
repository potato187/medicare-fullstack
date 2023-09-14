const { NotFoundRequestError } = require('@/core');
const { _BlogCategoryModel } = require('@/models');
const { UtilsRepo } = require('@/models/repository');
const { BLOG_CATEGORY_MODEL } = require('@/models/repository/constant');
const { getInfoData, convertToObjectIdMongodb } = require('@/utils');

class BlogCategoryService {
	static async findByFilter({ filter = {}, select = ['_id'] }) {
		const result = await UtilsRepo.findOne({
			model: BLOG_CATEGORY_MODEL,
			filter,
			select,
		});
		return result;
	}

	static async getAll(parentId = null, depth = 0, select = []) {
		const filter = {
			parentId,
			isDeleted: false,
			isDisplay: true,
		};

		const results = await _BlogCategoryModel.find(filter).sort({ index: 1 }).select(select).lean();

		const blogCategories = await Promise.all(
			results.map(async (blogCategory) => {
				const { _id, ...rest } = blogCategory;
				rest.id = _id;
				rest.depth = depth;
				rest.collapsed = false;
				rest.children = await BlogCategoryService.getAll(rest.id, depth + 1, select);
				return rest;
			}),
		);

		return blogCategories;
	}

	static getFlattenAll() {
		return UtilsRepo.getAll({
			model: BLOG_CATEGORY_MODEL,
			query: { isDeleted: false },
			sort: { index: 1 },
			select: ['_id', 'name', 'parentId', 'index'],
		});
	}

	static async checkExist(filter) {
		const result = await BlogCategoryService.findByFilter({ filter });
		if (!result) {
			throw new NotFoundRequestError();
		}
		return true;
	}

	static async createOne(body) {
		const { index, ...category } = body;
		const model = BLOG_CATEGORY_MODEL;

		if (!index) {
			category.index = await UtilsRepo.countByFilter({ model, filter: { parentId: null } });
		} else {
			category.index = index;
		}

		const newCategory = await UtilsRepo.createOne({
			model,
			body: category,
		});

		return getInfoData({
			fields: ['_id', 'parentId', 'name', 'slug', 'index'],
			object: newCategory,
		});
	}

	static async updateOneById({ id, updateBody }) {
		const select = Object.keys(updateBody);
		if (!select.length) return {};
		const filter = { _id: convertToObjectIdMongodb(id) };

		await BlogCategoryService.checkExist(filter);

		return UtilsRepo.findOneAndUpdate({
			model: BLOG_CATEGORY_MODEL,
			filter,
			updateBody,
			select,
		});
	}

	static async deleteByIds(body) {
		const promises = body.map(({ id }) =>
			BlogCategoryService.updateOneById({ id, updateBody: { isDeleted: true, isDisplay: false } }),
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

		const promises = updateOperations.map(async ({ filter, updateBody }) => {
			return UtilsRepo.findOneAndUpdate({
				model: BLOG_CATEGORY_MODEL,
				filter,
				updateBody,
				select: ['index', 'parentId'],
			});
		});

		return Promise.all(promises);
	}

	static async insertMany(body) {
		return _BlogCategoryModel.insertMany(body);
	}
}

module.exports = BlogCategoryService;
