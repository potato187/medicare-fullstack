'use strict';
const { _AdminModel } = require('@/models');
const { createSelectData, createSortData, createSearchData } = require('@/utils');

class AdminService {
	static async findByFilter(filter, select = ['_id']) {
		return await _AdminModel.findOne(filter).select(createSelectData(select)).lean().exec();
	}

	static async query({ key_search = '', select = ['_id'], sort = { updateAt: 'asc' }, page = 1, pagesize = 25 }) {
		let filter = {};
		const validPage = Math.max(1, page);
		const validPageSize = pagesize > 0 && pagesize < 100 ? pagesize : 25;
		const skip = (validPage - 1) * validPageSize;
		let _sort = createSortData(sort);

		if (key_search.length) {
			filter.$or = createSearchData(['firstName', 'lastName', 'email', 'phone'], key_search);
		}

		const totalPage = await _AdminModel.count();
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
				totalPage,
				keywords: key_search,
			},
		};
	}
}

module.exports = AdminService;
