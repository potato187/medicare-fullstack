const { _AdminModel } = require('@/models');
const { UtilsRepo, KeyTokenRepo } = require('@/models/repository');
const { ADMIN_MODEL } = require('@/models/repository/constant');
const { createSortData, createSearchData, createSelectData, convertToObjectIdMongodb } = require('@/utils');

const SEARCHABLE_FIELDS = ['firstName', 'lastName', 'email', 'phone'];

class AdminService {
	static async queryByParams({ search: keySearch = '', select = ['_id'], sort = [], page = 1, pagesize = 25 }) {
		const searchClause = {};
		const $page = Math.max(1, page);
		const $limit = pagesize > 0 && pagesize < 100 ? pagesize : 25;
		const $skip = ($page - 1) * $limit;
		const $sort = sort.length ? createSortData(sort) : { ctime: 1 };
		const $project = createSelectData(select);

		if (keySearch) {
			searchClause.$or = createSearchData(SEARCHABLE_FIELDS, keySearch);
		}

		const [{ results, total }] = await _AdminModel
			.aggregate()
			.match({
				isActive: 'active',
				isDeleted: false,
				...searchClause,
			})
			.facet({
				results: [{ $sort }, { $skip }, { $limit }, { $project }],
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
				page: $page,
				pagesize: $limit,
				totalPages: Math.ceil(total / $limit) || 1,
				keySearch,
			},
		};
	}

	static async updateOneById({ id, updateBody }) {
		const select = Object.keys(updateBody);

		if (!select.length) {
			return {};
		}

		const updatedAdmin = await UtilsRepo.findOneAndUpdate({
			model: ADMIN_MODEL,
			filter: { _id: convertToObjectIdMongodb(id) },
			updateBody,
			select,
		});

		return updatedAdmin;
	}

	static async deleteOneById(id) {
		const result = await AdminService.updateOneById({ id, updateBody: { isDeleted: true, isActive: 'inactive' } });
		if (result.isDeleted) {
			const store = await KeyTokenRepo.findOne({ userId: convertToObjectIdMongodb(id) }, ['_id']);
			if (store?._id) {
				await KeyTokenRepo.removeById(store._id);
			}
		}
		return {
			idDeletion: id,
		};
	}
}

module.exports = AdminService;
