'use strict';
const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Gender';

const genderSchema = new Schema(
	{
		gender_key: String,
		gender_name: {
			vi: String,
			en: String,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = model(DOCUMENT_NAME, genderSchema);
