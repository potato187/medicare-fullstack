'use strict';
const { GENDERS, STATUS, POSITIONS } = require('@/constant');
const { Schema, model, Types } = require('mongoose');

const DOCUMENT_NAME = 'Doctor';
const doctorSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
			required: true,
			enum: GENDERS,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		address: String,
		specialtyId: {
			type: Types.ObjectId,
			ref: 'Specialty',
			required: true,
		},
		position: {
			type: String,
			enum: POSITIONS,
			required: true,
			default: POSITIONS[0],
		},
		appointments: {
			type: Array,
			required: true,
			default: [],
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: String,
			enum: STATUS,
			default: 'active',
		},
	},
	{
		timestamps: true,
	},
);

module.exports = model(DOCUMENT_NAME, doctorSchema);
