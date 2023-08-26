'use strict';

const MONGODB_EXCLUDE_FIELDS = ['_id', '__v', 'createdAt', 'updatedAt'];
const ROLES = ['admin', 'mod'];
const GENDERS = ['GF', 'GM', 'GO'];
const STATUS = ['active', 'inactive'];

module.exports = {
	MONGODB_EXCLUDE_FIELDS,
	ROLES,
	GENDERS,
	STATUS,
};
