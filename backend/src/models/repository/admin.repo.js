'use strict';
const { createSelectData } = require('@/utils');
const _AdminModel = require('../admin.model');

/* 
  Admin Repository
  1 - Find by filter and select [admin] 
  2 - Create a new admin [admin]
*/
class AdminRepo {
	static async findByFilter(filter, select = ['_id']) {
		return await _AdminModel.findOne(filter).select(createSelectData(select)).lean().exec();
	}

	static async createAdmin(body) {
		return await _AdminModel.create(body);
	}

	static async updateAdminById(id, updateBody) {
		return await _AdminModel.findByIdAndUpdate(id, updateBody);
	}
}

module.exports = AdminRepo;
