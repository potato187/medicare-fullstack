const { BOOKING_STATUS, GENDERS, GENDER_DEFAULT } = require('@/constant');
const { Schema, model, Types } = require('mongoose');

const DOCUMENT_NAME = 'Booking';

const createSchema = new Schema(
	{
		specialtyId: {
			type: Types.ObjectId,
			ref: 'SpecialtyId',
			required: true,
		},
		doctorId: {
			type: Types.ObjectId,
			ref: 'Doctor',
			required: true,
		},
		workingHourId: {
			type: Types.ObjectId,
			ref: 'WorkingHour',
			required: true,
		},
		appointmentDate: {
			type: Date,
			default: Date.now,
			required: true,
		},
		status: {
			type: String,
			enum: BOOKING_STATUS,
			default: 'pending',
		},
		fullName: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		dateOfBirth: {
			type: Date,
			required: true,
		},
		gender: {
			type: String,
			enum: GENDERS,
			default: GENDER_DEFAULT,
		},
		address: {
			type: String,
			default: '',
		},
		note: {
			type: String,
			default: '',
		},
		isVerify: {
			type: Boolean,
			default: false,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timeseries: {
			createdAt: 'createdOn',
			updatedAt: 'modifiedOn',
		},
	},
);

module.exports = model(DOCUMENT_NAME, createSchema);
