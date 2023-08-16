'use strict';
const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'KeyToken';

var keyTokenSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			require: true,
			ref: 'Admin',
		},
		privateKey: {
			type: String,
			require: true,
		},
		publicKey: {
			type: String,
			require: true,
		},
		refreshTokenUsed: {
			type: Array,
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
