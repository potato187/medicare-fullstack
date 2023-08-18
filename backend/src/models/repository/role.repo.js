'use strict';
const { createSelectData } = require('@/utils');
const _RoleModel = require('../role.model');

class RoleRepo {
	static async getPermissionsById(id, select = ['permissions']) {
		const permissions = await _RoleModel.findById(id).select(createSelectData(select)).exec();
		return permissions || [];
	}
}

module.exports = RoleRepo;
