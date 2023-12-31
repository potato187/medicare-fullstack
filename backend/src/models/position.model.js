const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Position';

const positionSchema = new Schema(
	{
		key: {
			type: String,
			unique: true,
			required: true,
		},
		name: {
			vi: {
				type: String,
				required: true,
			},
			en: {
				type: String,
				required: true,
			},
		},
	},
	{
		timestamps: true,
	},
);

module.exports = model(DOCUMENT_NAME, positionSchema);
