'use strict';
const { MONGODB_EXCLUDE_FIELDS } = require('@/constant');
const { createUnSelectData } = require('@/utils');
const _GenderModel = require('../gender.model');

class GenderRepo {
	static async getAllGender() {
		return await _GenderModel.find().sort({ gender_key: 1 }).select(createUnSelectData(MONGODB_EXCLUDE_FIELDS)).lean();
	}
}

module.exports = GenderRepo;
