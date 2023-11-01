const { UtilsRepo } = require('@/models/repository');
const { createSortData, createSelectData } = require('@/utils');

class ResourceService {
	static async getAll({ model, sort, select, ...query }) {
		const result = await UtilsRepo.getAll({
			model,
			query,
			sort: sort ? createSortData(sort) : { key: 1 },
			select: select ? createSelectData(select) : ['key', 'name'],
		});

		return result;
	}

	static async insertMany({ model, data = [] }) {
		const result = await UtilsRepo.insertMany({
			model,
			dataArray: data,
		});

		return result;
	}
}

module.exports = ResourceService;
