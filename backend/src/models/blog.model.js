const { createSlug } = require('@/utils');
const { Schema, model, Types } = require('mongoose');

const DOCUMENT_NAME = 'Blog';
const blogSchema = new Schema(
	{
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
		image: String,
		slug: {
			vi: String,
			en: String,
		},
		summary: {
			vi: String,
			en: String,
		},
		content: {
			vi: String,
			en: String,
		},
		coverImage: String,
		tags: [
			{
				type: String,
				trim: true,
			},
		],
		postCategoryIds: [
			{
				type: Types.ObjectId,
				ref: 'PostCategory',
			},
		],
		datePublished: {
			type: Date,
			default: Date.now,
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
	{ timestamps: true },
);

blogSchema.pre('save', function addSlug(next) {
	this.slug = {
		vi: createSlug(this.title.vi),
		en: createSlug(this.title.en),
	};
	next();
});

module.exports = model(DOCUMENT_NAME, blogSchema);
