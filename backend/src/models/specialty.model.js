'use strict';
const { Schema, model } = require('mongoose');
const { default: slugify } = require('slugify');

const DOCUMENT_NAME = 'Specialty';
const COLLECTION_NAME = 'specialties';

const specialtySchema = new Schema(
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
		slug: {
			vi: String,
			en: String,
		},
		description: {
			vi: String,
			en: String,
		},
		image: String,
		isActive: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'active',
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

const Specialization = model(DOCUMENT_NAME, specialtySchema);

specialtySchema.pre('save', function (next) {
	this.slug.vi = slugify(this.name.vi, { lower: true });
	this.slug.en = slugify(this.name.en, { lower: true });
	next();
});

module.exports = Specialization;
