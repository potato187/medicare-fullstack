'use strict';
const { UtilsRepo } = require('@/models/repository');
const { createSortData, createSelectData } = require('@/utils');

class ResourceService {
	static async getAll({ model, sort, select, ...query }) {
		return await UtilsRepo.getAll({
			model,
			query,
			sort: sort ? createSortData(sort) : { key: 1 },
			select: select ? createSelectData(select) : ['key', 'name'],
		});
	}

	static async insertMany({ model, data = [] }) {
		return await UtilsRepo.insertMany({
			model,
			dataArray: data,
		});
	}
}

module.exports = ResourceService;
