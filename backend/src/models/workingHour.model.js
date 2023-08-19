'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'WorkingHour';

const workingHourSchema = new Schema(
	{
		wh_key: String,
		wh_name: {
			vi: String,
			en: String,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = model(DOCUMENT_NAME, workingHourSchema);
