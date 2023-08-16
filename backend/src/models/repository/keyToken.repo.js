'use strict';
const { createSelectData } = require('@/utils');
const keyTokenModel = require('../keyToken.model');

class KeyTokenRepo {
	static async findByFilter(filter, select = ['_id']) {
		return await keyTokenModel.findOne(filter).select(createSelectData(select));
	}
}

module.exports = KeyTokenRepo;
