'use strict';
const { createSelectData } = require('@/utils');
const _KeyTokenModel = require('../keyToken.model');

class KeyTokenRepo {
	static async findByFilter(filter, select = ['_id']) {
		return await _KeyTokenModel.findOne(filter).select(createSelectData(select));
	}
}

module.exports = KeyTokenRepo;
