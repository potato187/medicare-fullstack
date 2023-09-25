const { LINK_TYPES } = require('@/constant');
const { Schema, Types, model } = require('mongoose');

const DOCUMENT_NAME = 'Link';

const linkSchema = new Schema(
	{
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
		type: {
			type: String,
			enum: LINK_TYPES,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
		index: {
			type: Number,
			required: true,
		},
		parentId: {
			type: Types.ObjectId,
			ref: DOCUMENT_NAME,
			default: null,
		},
		isDisplay: {
			type: Boolean,
			default: false,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = model(DOCUMENT_NAME, linkSchema);
