const { slugValidator, dateValidator, ObjectIdMongodbValidator } = require('@/validations');
const Joi = require('joi');

const titleValidator = Joi.string().trim().min(3).max(250);

const createSchema = Joi.object({
	title: Joi.object({
		vi: titleValidator.required(),
		en: titleValidator.required(),
	}),
	slug: {
		vi: slugValidator.allow(''),
		en: slugValidator.allow(''),
	},
	summary: {
		vi: Joi.string().max(100).allow(''),
		en: Joi.string().max(100).allow(''),
	},
	content: {
		vi: Joi.string().min(50).allow(''),
		en: Joi.string().min(50).allow(''),
	},
	datePublished: dateValidator,
	tags: Joi.array().items(Joi.string().min(2).max(20)),
	postCategories: Joi.array().items(ObjectIdMongodbValidator),
});

const updateSchema = Joi.object({
	title: {
		vi: titleValidator,
		en: titleValidator,
	},
	slug: {
		vi: slugValidator,
		en: slugValidator,
	},
	summary: Joi.object({
		vi: Joi.string().max(250),
		en: Joi.string().max(250),
	}),
	content: {
		vi: Joi.string().allow(''),
		en: Joi.string().allow(''),
	},
	datePublished: dateValidator,
	tags: Joi.array().items(Joi.string().min(2).max(20)),
	postCategories: Joi.array().items(ObjectIdMongodbValidator),
	isDeleted: Joi.boolean(),
	isDisplay: Joi.boolean(),
});

const querySchema = Joi.object();

module.exports = {
	createSchema,
	updateSchema,
	querySchema,
};
