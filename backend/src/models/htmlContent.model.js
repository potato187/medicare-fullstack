const { Schema, model } = require('mongoose');

const DOCUMENT_MODEL = 'htmlContent';

const htmlContentSchema = new Schema(
	{
		pageType: {
			type: String,
			enum: ['home', 'blog', 'blog_category', 'contact'],
			default: 'home',
			required: true,
		},
		positionType: {
			type: String,
			enum: ['header', 'main', 'footer', 'top', 'left', 'bottom', 'right'],
			default: 'main',
			required: true,
		},
		index: {
			type: Number,
			default: 0,
		},
		title: {
			vi: String,
			en: String,
		},
		content: {
			vi: String,
			en: String,
		},
		url: String,
		image: String,
		icon: String,
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

module.exports = model(DOCUMENT_MODEL, htmlContentSchema);
