'use strict';
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const { ROLES } = require('@/constant');
const DOCUMENT_NAME = 'Admin';

const adminSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},

		lastName: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
		},
		role: {
			type: String,
			enum: ROLES,
		},
	},
	{
		timestamps: true,
	},
);

adminSchema.index({ firstName: 'text', lastName: 'text', email: 'text', phone: 'text' });

adminSchema.pre('save', function (next) {
	this.password = bcrypt.hashSync(this.password, 10);
	next();
});

module.exports = model(DOCUMENT_NAME, adminSchema);
