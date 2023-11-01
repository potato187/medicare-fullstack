const { _BlogCategoryModel } = require('@/models');
const { UtilsRepo } = require('@/models/repository');
const { BLOG_CATEGORY_MODEL } = require('@/models/repository/constant');
const { getInfoData, convertToObjectIdMongodb, typeOf } = require('@/utils');

class BlogCategoryService {
	static model = BLOG_CATEGORY_MODEL;

	static async createOne(body) {
		const { index, ...category } = body;
		const { model } = BlogCategoryService;

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

	static async insertMany(body) {
		return _BlogCategoryModel.insertMany(body);
	}

	static async getAll(parentId = null, depth = 0, select = []) {
		const filter = {
			parentId,
			isDeleted: false,
		};

		const results = await _BlogCategoryModel.find(filter).sort({ index: 1 }).select(select).lean();

		const blogCategories = await Promise.all(
			results.map(async (blogCategory) => {
				const { _id, ...rest } = blogCategory;
				rest.id = _id;
				rest.depth = depth;
				rest.collapsed = false;
				rest.isSelected = false;
				rest.children = await BlogCategoryService.getAll(rest.id, depth + 1, select);
				return rest;
			}),
		);

		return blogCategories;
	}

	static getFlattenAll() {
		return UtilsRepo.getAll({
			model: BlogCategoryService.model,
			query: { isDeleted: false },
			sort: { index: 1 },
			select: ['_id', 'name', 'parentId', 'index'],
		});
	}

	static async updateChildrenByParentId({ parentId, updateBody }) {
		const childCategories = await _BlogCategoryModel.find({ parentId: convertToObjectIdMongodb(parentId) });

		const updatePromises = [];

		for (const blogCategory of childCategories) {
			Object.entries(updateBody).forEach(([key, value]) => {
				blogCategory[key] = value;
			});

			updatePromises.push(blogCategory.save());
			updatePromises.push(BlogCategoryService.updateChildrenByParentId({ parentId: blogCategory._id, updateBody }));
		}

		return Promise.all(updatePromises);
	}

	static async updateOneById({ id, updateBody }) {
		const select = Object.keys(updateBody);
		if (!select.length) return null;
		const filter = { _id: convertToObjectIdMongodb(id) };

		await UtilsRepo.checkIsExist({
			model: BlogCategoryService.model,
			filter,
		});

		await UtilsRepo.findOneAndUpdate({
			model: BlogCategoryService.model,
			filter,
			updateBody,
			select,
		});

		if (typeOf(updateBody.isDisplay) === 'boolean') {
			await BlogCategoryService.updateChildrenByParentId({
				parentId: id,
				updateBody: { isDisplay: updateBody.isDisplay },
			});
		}

		return BlogCategoryService.getAll();
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
				model: BlogCategoryService.model,
				filter,
				updateBody,
				select: ['index', 'parentId'],
			});
		});

		return Promise.all(promises);
	}
}

module.exports = BlogCategoryService;
