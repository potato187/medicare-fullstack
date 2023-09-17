const { UtilsRepo } = require('@/models/repository');
const { BLOG_MODEL } = require('@/models/repository/constant');
const { getInfoData, convertToObjectIdMongodb, createSearchData } = require('@/utils');

const SEARCHABLE_FIELDS = ['title.vi', 'title.en'];

class BlogService {
	static model = BLOG_MODEL;

	static getOneById(id) {
		return UtilsRepo.findOne({
			model: this.model,
			filter: { _id: convertToObjectIdMongodb(id) },
			select: { __v: 0, updatedAt: 0, createdAt: 0, isDeleted: 0, isDisplay: 0 },
		});
	}

	static async getByQueryParams(queryParams) {
		const { categoryId, search, ...params } = queryParams;
		const match = { isDeleted: false };
		if (search) {
			match.$or = createSearchData(SEARCHABLE_FIELDS, search);
		}

		if (categoryId && categoryId !== 'all') {
			match.blogCategoryIds = convertToObjectIdMongodb(categoryId);
		}

		return UtilsRepo.getByQueryParams({
			model: this.model,
			queryParams: { match, ...params },
		});
	}

	static async createOne(body) {
		const newCategory = await UtilsRepo.createOne({
			model: BlogService.model,
			body,
		});

		return getInfoData({
			fields: ['_id', 'title', 'datePublished', 'isDisplay'],
			object: newCategory,
		});
	}

	static async updateOneById({ id, updateBody }) {
		const select = Object.keys(updateBody);
		const { blogCategoryIds, ...body } = updateBody;
		const filter = { _id: convertToObjectIdMongodb(id), isDeleted: false };

		if (!select.length) return {};

		await UtilsRepo.checkIsExist({
			model: this.model,
			filter,
		});

		if (blogCategoryIds) {
			blogCategoryIds.forEach((blogCategoryId, index) => {
				blogCategoryIds[index] = convertToObjectIdMongodb(blogCategoryId);
			});

			body.blogCategoryIds = blogCategoryIds;
		}

		return UtilsRepo.findOneAndUpdate({
			model: this.model,
			filter,
			updateBody: body,
			select,
		});
	}

	static async deleteOneById(id) {
		return BlogService.updateOneById({ id, updateBody: { isDeleted: true, isDisplay: false } });
	}
}

module.exports = BlogService;
