'use strict';
const { MONGODB_EXCLUDE_FIELDS } = require('@/constant');
const { createSelectData, createUnSelectData } = require('@/utils');
const _RoleModel = require('../role.model');

class RoleRepo {
	static async getPermissionsById(id, select = ['permissions']) {
		const permissions = await _RoleModel.findById(id).select(createSelectData(select)).exec();
		return permissions || [];
	}

	static async getAllAAdminRole() {
		return await _RoleModel.find().sort({ role_key: 1 }).select(createUnSelectData(MONGODB_EXCLUDE_FIELDS)).lean();
	}
}

module.exports = RoleRepo;
