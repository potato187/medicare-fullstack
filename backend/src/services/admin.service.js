'use strict';
const { ConflictRequestError } = require('@/core');
const { _AdminModel } = require('@/models');
const { AdminRepo } = require('@/models/repository');
const { createSelectData, createSortData, createSearchData, getInfoData } = require('@/utils');

/* 
	Admin Service
	1 - Query list Admin [admin]
*/

class AdminService {
	static async query({ key_search = '', select = ['_id'], sort = { updateAt: 'asc' }, page = 1, pagesize = 25 }) {
		let filter = {};
		const validPage = Math.max(1, page);
		const validPageSize = pagesize > 0 && pagesize < 100 ? pagesize : 25;
		const skip = (validPage - 1) * validPageSize;
		let _sort = createSortData(sort);

		if (key_search.length) {
			filter.$or = createSearchData(['firstName', 'lastName', 'email', 'phone'], key_search);
		}

		const documents = await _AdminModel
			.find(filter)
			.sort(_sort)
			.skip(skip)
			.limit(validPageSize)
			.select(createSelectData(select))
			.lean()
			.exec();

		return {
			data: documents,
			meta: {
				page: validPage,
				pagesize: validPage,
				keywords: key_search,
			},
		};
	}

	static async getTotalPages() {
		const totalPages = await _AdminModel.count();
		return { totalPages };
	}
}

module.exports = AdminService;
