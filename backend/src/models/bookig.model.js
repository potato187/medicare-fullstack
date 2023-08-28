'use strict';
const { BOOKING_STATUS } = require('@/constant');
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Booking';

const bookingSchema = new Schema(
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
		patientId: {
			type: Types.ObjectId,
			ref: 'Patient',
			required: true,
		},
		appointmentDate: {
			type: Date,
			required: true,
		},
		status: {
			type: String,
			enum: BOOKING_STATUS,
			default: 'pending',
		},
		notes: String,
	},
	{
		timeseries: {
			createdAt: 'createdOn',
			updatedAt: 'modifiedOn',
		},
	},
);

module.exports = model(DOCUMENT_NAME, bookingSchema);
