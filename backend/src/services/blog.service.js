const { NotFoundRequestError } = require('@/core');
const { _BlogModel } = require('@/models');
const { UtilsRepo } = require('@/models/repository');
const { BLOG_MODEL } = require('@/models/repository/constant');
const {
	getInfoData,
	convertToObjectIdMongodb,
	createSelectData,
	createSearchData,
	createSortData,
} = require('@/utils');

const SEARCHABLE_FIELDS = ['title.vi', 'title.en'];

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
		const { blogCategoryIds, ...body } = updateBody;
		const filter = { _id: convertToObjectIdMongodb(id), isDeleted: false };

		if (blogCategoryIds && blogCategoryIds.length) {
			blogCategoryIds.forEach((blogCategoryId, index) => {
				blogCategoryIds[index] = convertToObjectIdMongodb(blogCategoryId);
			});

			body.blogCategoryIds = blogCategoryIds;
		}

		await BlogService.checkExist(filter);

		return UtilsRepo.findOneAndUpdate({
			model: BlogService.model,
			filter,
			updateBody: body,
			select,
		});
	}

	static async deleteOneById(id) {
		return BlogService.updateOneById({ id, updateBody: { isDeleted: true, isDisplay: false } });
	}

	static async queryByParams(queryParams) {
		const { categoryId, search, sort = [], page = 1, pagesize = 25, select = [] } = queryParams;
		const $skip = (+page - 1) * pagesize;
		const $limit = +pagesize;
		const $sort = sort.length ? createSortData(sort) : { ctime: 1 };
		const _select = createSelectData(select);
		const $match = { isDeleted: false };

		if (search) {
			$match.$or = createSearchData(SEARCHABLE_FIELDS, search);
		}

		if (categoryId && categoryId !== 'all') {
			$match.blogCategoryIds = convertToObjectIdMongodb(categoryId);
		}

		const [{ results, total }] = await _BlogModel
			.aggregate()
			.match($match)
			.facet({
				results: [
					{ $sort },
					{ $skip },
					{ $limit },
					{
						$project: {
							id: '$_id',
							..._select,
						},
					},
				],
				totalCount: [{ $count: 'count' }],
			})
			.addFields({
				total: {
					$ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0],
				},
			})
			.project({
				results: 1,
				total: 1,
			});

		return {
			data: results,
			meta: {
				page: +page,
				pagesize: $limit,
				totalPages: Math.ceil(total / $limit) || 1,
				search,
			},
		};
	}

	static getOneById({ id, select }) {
		return BlogService.findByFilter({ filter: { _id: convertToObjectIdMongodb(id) }, select });
	}
}

module.exports = BlogService;
