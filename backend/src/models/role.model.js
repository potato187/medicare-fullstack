'use strict';
const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Role';

const roleSchema = new Schema(
	{
		name: {
			type: String,
			require: true,
		},
		permissions: {
			type: [String],
			enum: ['read', 'write', 'delete', 'edit'],
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

module.exports = model(DOCUMENT_NAME, roleSchema);
