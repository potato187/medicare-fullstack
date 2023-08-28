'use strict';

const MONGODB_EXCLUDE_FIELDS = ['_id', '__v', 'createdAt', 'updatedAt'];
const ROLES = ['admin', 'mod'];
const GENDERS = ['GF', 'GM', 'GO'];
const STATUS = ['active', 'inactive'];
const BOOKING_STATUS = ['pending', 'confirmed', 'completed', 'cancelled'];

module.exports = {
	MONGODB_EXCLUDE_FIELDS,
	ROLES,
	GENDERS,
	STATUS,
	BOOKING_STATUS,
};
