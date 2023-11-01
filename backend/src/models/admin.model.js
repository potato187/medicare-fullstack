const { ROLES, GENDERS } = require('@/constant');
const bcrypt = require('bcrypt');
const { Schema, model } = require('mongoose');

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
			default: ROLES[1],
		},
		gender: {
			type: String,
			enum: GENDERS,
			default: GENDERS[0],
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'active',
		},
	},
	{
		timestamps: true,
	},
);

adminSchema.pre('save', function hasPassword(next) {
	this.password = bcrypt.hashSync(this.password, 10);
	next();
});

adminSchema.pre('findOneAndUpdate', function hasPassword(next) {
	if (this._update.password) {
		this._update.password = bcrypt.hashSync(this._update.password, 10);
	}
	next();
});

module.exports = model(DOCUMENT_NAME, adminSchema);
