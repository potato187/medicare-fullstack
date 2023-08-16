'use strict';
const { AdminModel } = require('@/models');
const { createSelectData } = require('@/utils');

class AdminService {
	static async findByFilter(filter, select = ['_id']) {
		return await AdminModel.findOne(filter).select(createSelectData(select)).lean().exec();
	}
}

module.exports = AdminService;
