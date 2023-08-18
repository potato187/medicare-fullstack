'use strict';
const { _AdminModel } = require('@/models');
const { createSelectData, createSortData } = require('@/utils');

class AdminService {
	static async findByFilter(filter, select = ['_id']) {
		return await _AdminModel.findOne(filter).select(createSelectData(select)).lean().exec();
	}

	static async query({ key_search = '', select = ['_id'], sort = { updateAt: 'asc' }, page = 1, pagesize = 25 }) {
		const filter = {};
		const options = {};
		const validPage = Math.max(1, page);
		const validPageSize = pagesize > 0 && pagesize < 100 ? pagesize : 25;
		const skip = (validPage - 1) * validPageSize;

		if (key_search.length) {
			const regexSearch = new RegExp(key_search);
			filter[`$text`] = { $search: regexSearch };
			options['score'] = { $meta: 'textScore' };
		}

		const totalPage = await _AdminModel.count();
		const documents = await _AdminModel
			.find(filter)
			.sort(createSortData(sort))
			.skip(skip)
			.limit(validPageSize)
			.select(createSelectData(select))
			.lean();

		return {
			data: documents,
			meta: {
				page: validPage,
				pagesize: validPage,
				totalPage,
			},
		};
	}
}

module.exports = AdminService;
