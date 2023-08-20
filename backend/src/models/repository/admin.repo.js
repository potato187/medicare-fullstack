'use strict';
const { createSelectData } = require('@/utils');
const _AdminModel = require('../admin.model');

class AdminRepo {
	static async findByFilter(filter, select = ['_id']) {
		return await _AdminModel.findOne(filter).select(createSelectData(select)).lean().exec();
	}

	static async createAdmin(body) {
		return await _AdminModel.create(body);
	}

	static async updateAdminById(id, updateBody) {
		return await _AdminModel.findByIdAndUpdate(id, updateBody, { new: true });
	}
}

module.exports = AdminRepo;
