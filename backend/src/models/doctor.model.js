'use strict';
const { GENDERS, BOOKING_STATUS } = require('@/constant');
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
		qualificationId: {
			type: Types.ObjectId,
			ref: 'Quantification',
			required: true,
		},
		appointments: [
			{
				bookingId: Types.ObjectId,
				ref: 'booking',
				required: true,
			},
		],
		default: [],
	},
	{
		timestamps: true,
	},
);

module.exports = model(DOCUMENT_NAME, doctorSchema);
