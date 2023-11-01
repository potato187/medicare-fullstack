const { PAGES, PAGE_POSITIONS } = require('@/constant');
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'HtmlContent';

const htmlContentSchema = new Schema(
	{
		pageType: {
			type: [String],
			enum: PAGES,
			default: ['home'],
			required: true,
		},
		positionType: {
			type: String,
			enum: PAGE_POSITIONS,
			default: 'main',
			required: true,
		},
		index: {
			type: Number,
			default: 0,
		},
		title: {
			vi: {
				type: String,
				required: true,
			},
			en: {
				type: String,
				required: true,
			},
		},
		content: {
			vi: {
				type: String,
				default: '',
			},
			en: {
				type: String,
				default: '',
			},
		},
		url: {
			type: String,
			default: '',
		},
		image: {
			type: String,
			default: '',
		},
		icon: {
			type: String,
			default: '',
		},
		isDisplay: {
			type: Boolean,
			default: true,
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

module.exports = model(DOCUMENT_NAME, htmlContentSchema);
