'use strict';
const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Role';

const roleSchema = new Schema(
	{
		role_key: String,
		role_name: {
			vi: String,
			en: String,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = model(DOCUMENT_NAME, roleSchema);
