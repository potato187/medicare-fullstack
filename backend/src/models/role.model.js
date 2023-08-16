'use strict';
const { ROLES } = require('@/constant');
const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Role';

const roleSchema = new Schema(
	{
		roleId: {
			type: String,
			enum: ROLES,
		},
		name: {
			type: String,
			require: true,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = model(DOCUMENT_NAME, roleSchema);
