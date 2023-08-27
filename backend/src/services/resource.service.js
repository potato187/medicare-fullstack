'use strict';
const { MONGODB_EXCLUDE_FIELDS } = require('@/constant');
const { UtilsRepo } = require('@/models/repository');
const { GENDER_MODEL } = require('@/models/repository/constant');
const { createUnSelectData } = require('@/utils');

class ResourceService {
	static async getAllGender() {
		return await UtilsRepo.getAll({
			model: GENDER_MODEL,
			sort: { gender_key: 1 },
			select: createUnSelectData(MONGODB_EXCLUDE_FIELDS),
		});
	}

	static async getAllAAdminRole() {
		return await UtilsRepo.getAll({
			model: GENDER_MODEL,
			sort: { role_key: 1 },
			select: createUnSelectData(MONGODB_EXCLUDE_FIELDS),
		});
	}
}

module.exports = ResourceService;
