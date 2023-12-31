const { createSlug } = require('@/utils');
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Specialty';
const COLLECTION_NAME = 'specialties';

const specialtySchema = new Schema(
	{
		key: {
			type: String,
			unique: true,
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

specialtySchema.pre('save', function autoAddSlug(next) {
	this.slug.vi = createSlug(this.name.vi);
	this.slug.en = createSlug(this.name.en);
	next();
});

module.exports = model(DOCUMENT_NAME, specialtySchema);
