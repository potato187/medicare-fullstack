'use strict';
const { MONGODB_EXCLUDE_FIELDS } = require('@/constant');
const { UtilsRepo } = require('@/models/repository');
const { createUnSelectData, createSortData, createSelectData } = require('@/utils');

class ResourceService {
	static async getAll({ model, sort, select }) {
		return await UtilsRepo.getAll({
			model,
			sort: sort ? createSortData(sort) : { ctime: 1 },
			select: select ? createSelectData(select) : createUnSelectData(MONGODB_EXCLUDE_FIELDS),
		});
	}
}

module.exports = ResourceService;
