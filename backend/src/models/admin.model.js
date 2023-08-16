'use strict';
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const { ROLES } = require('@/constant');
const DOCUMENT_NAME = 'Admin';

const adminSchema = new Schema(
	{
		firstName: {
			type: String,
			require: true,
		},

		lastName: {
			type: String,
			require: true,
		},
		email: {
			type: String,
			require: true,
			unique: true,
		},
		password: {
			type: String,
		},
		role_key: {
			type: String,
			enum: ROLES,
		},
	},
	{
		timestamps: true,
	},
);

adminSchema.pre('save', function (next) {
	this.password = bcrypt.hashSync(this.password, 10);
	next();
});

module.exports = model(DOCUMENT_NAME, adminSchema);
