'use strict';
const { ROLES } = require('@/constant');
const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Role';

const roleSchema = new Schema(
	{
		role_key: {
			type: String,
			enum: ROLES,
			required: true,
		},
		role_name: {
			vi: {
				type: String,
				required: true,
			},
			en: {
				type: String,
				required: true,
			},
		},
	},
	{
		timestamps: true,
	},
);

module.exports = model(DOCUMENT_NAME, roleSchema);
