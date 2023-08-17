'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Doctor';
const doctorSchema = new Schema(
	{
		firstName: {
			type: String,
			require: true,
		},
		lastName: {
			type: String,
			require: true,
		},
		gender: {
			type: String,
			require: true,
			enum: ['GF', 'GM', 'GO'],
		},
		email: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		address: String,
		specialization: {
			type: String,
			required: true,
		},
		qualificationId: {
			type: String,
			required: true,
		},
		appointments: [
			{
				date: Date,
				patient: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Patient',
				},
			},
		],
	},
	{
		timestamps: true,
	},
);

module.exports = model(DOCUMENT_NAME, doctorSchema);
