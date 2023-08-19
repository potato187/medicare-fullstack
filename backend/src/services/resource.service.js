'use strict';
const { GenderRepo, RoleRepo } = require('@/models/repository');

class ResourceService {
	static async getAllGender() {
		return await GenderRepo.getAllGender();
	}

	static async getAllAAdminRole() {
		return await RoleRepo.getAllAAdminRole();
	}
}

module.exports = ResourceService;
