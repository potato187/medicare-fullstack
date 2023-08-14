'use strict';
const { createSelectData } = require('@/utils');
const AdminModel = require('../admin.model');

const findByFilter = async ({ filter, select = ['_id'] }) => {
	return await AdminModel.findOne(filter).select(createSelectData(select)).lean();
};

module.exports = {
	findByFilter,
};
