const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'KeyToken';

const keyTokenSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Admin',
		},
		privateKey: {
			type: String,
			required: true,
		},
		publicKey: {
			type: String,
			required: true,
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
