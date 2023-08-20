'use strict';
const { _AdminModel } = require('@/models');
const { UtilsRepo, AdminRepo } = require('@/models/repository');
const { createSortData, createSearchData, getInfoData } = require('@/utils');

class AdminService {
	static async query({ key_search = '', select = ['_id'], sort = { updateAt: 'asc' }, page = 1, pagesize = 25 }) {
		const searchClause = {};
		const _page = Math.max(1, page);
		const _limit = pagesize > 0 && pagesize < 100 ? pagesize : 25;
		const _skip = (_page - 1) * _limit;
		let _sort = createSortData(sort);

		if (key_search) {
			searchClause.$or = createSearchData(['firstName', 'lastName', 'email', 'phone'], key_search);
		}

		const [{ results, total }] = await _AdminModel
			.aggregate()
			.match({
				isActive: 'active',
				isDeleted: false,
				...searchClause,
			})
			.facet({
				results: [
					{ $sort: _sort },
					{ $skip: _skip },
					{ $limit: _limit },
					{
						$project: {},
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
				page: _page,
				pagesize: _limit,
				totalPages: Math.ceil(total / _limit),
				key_search,
			},
		};
	}

	static async updateAdminById(body) {
		const { id, updateBody } = body;

		const updatedAdmin = await AdminRepo.updateAdminById(id, updateBody);

		return {
			admin: getInfoData({ fields: ['_id', 'firstName', 'lastName', 'email', 'phone', 'role'], object: updatedAdmin }),
		};
	}

	static async deleteAdminById(id) {
		await AdminRepo.updateAdminById(id, { isDeleted: true });
		return { deletedAdminId: id };
	}
}

module.exports = AdminService;
