const { Schema, model, Types } = require('mongoose');
const { createSlug } = require('@/utils');

const DOCUMENT_NAME = 'PostCategory';
const COLLECTION_NAME = 'postCategories';

const postCategorySchema = new Schema(
	{
		index: {
			type: Number,
			required: true,
		},
		parentId: {
			type: Types.ObjectId,
			ref: DOCUMENT_NAME,
			default: null,
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
		slug: {
			vi: String,
			en: String,
		},
		description: {
			vi: String,
			en: String,
		},
		banner: {
			type: String,
		},
		display: {
			type: Boolean,
			default: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true, collection: COLLECTION_NAME },
);

postCategorySchema.pre('save', function autoAddSlug(next) {
	this.slug = {
		vi: createSlug(this.name.vi),
		en: createSlug(this.name.en),
	};

	next();
});

module.exports = model(DOCUMENT_NAME, postCategorySchema);
