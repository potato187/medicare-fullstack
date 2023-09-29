const { PAGES, PAGE_POSITIONS, SORT_OPTIONS } = require('@/constant/news.constant');
const { Schema, model, Types } = require('mongoose');

const DOCUMENT_NAME = 'News';

const newsSchema = new Schema(
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
		blogCategoryIds: {
			type: [
				{
					type: Types.ObjectId,
					ref: 'blogCategory',
				},
			],
			default: [],
		},
		order: {
			type: String,
			enum: SORT_OPTIONS,
			default: 'createdAt_desc',
		},
		index: {
			type: Number,
			default: 0,
		},
		quantity: {
			type: Number,
			default: 1,
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

module.exports = model(DOCUMENT_NAME, newsSchema);
