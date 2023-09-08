'use strict';
const { createSlug } = require('@/utils');
const { func } = require('joi');
const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'PostCategory';
const COLLECTION_NAME = 'postCategories';

const postCategorySchema = new Schema(
	{
		index: {
			type: Number,
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
		subCategories: {
			type: Array,
			default: [],
		},
		posts: {
			type: Array,
			default: [],
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

postCategorySchema.pre('save', function (next) {
	this.slug = {
		vi: createSlug(this.name.vi),
		en: createSlug(this.name.en),
	};

	next();
});

module.exports = model(DOCUMENT_NAME, postCategorySchema);
