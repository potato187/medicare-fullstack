const {
	slugValidator,
	dateValidator,
	ObjectIdMongodbValidator,
	pageValidator,
	pageSizeValidator,
	sortValidator,
	selectValidator,
	keySearchValidator,
} = require('@/validations');
const Joi = require('joi');

const SORTABLE_FIELDS = ['title', 'isDisplay', 'datePublished', 'createdAt'];
const SELECT_FIELDS = ['title', 'slug', 'datePublished', 'isDisplay'];

const titleValidator = Joi.string().trim().min(3).max(250);

const createSchema = Joi.object().keys({
	title: Joi.object().keys({
		vi: titleValidator.required(),
		en: titleValidator.required(),
	}),
	slug: Joi.object().keys({
		vi: slugValidator.allow('').default(''),
		en: slugValidator.allow('').default(''),
	}),
	summary: Joi.object().keys({
		vi: Joi.string().max(100).allow('').default(''),
		en: Joi.string().max(100).allow('').default(''),
	}),
	content: Joi.object().keys({
		vi: Joi.string().allow('').default(''),
		en: Joi.string().allow('').default(''),
	}),
	datePublished: dateValidator,
	blogCategoryIds: Joi.array().items(ObjectIdMongodbValidator),
	image: Joi.string().allow('').default(''),
});

const updateSchema = Joi.object({
	title: Joi.object({
		vi: titleValidator,
		en: titleValidator,
	}),
	slug: Joi.object({
		vi: slugValidator,
		en: slugValidator,
	}),
	summary: Joi.object({
		vi: Joi.string().max(250),
		en: Joi.string().max(250),
	}),
	content: {
		vi: Joi.string().allow(''),
		en: Joi.string().allow(''),
	},
	datePublished: dateValidator,
	blogCategoryIds: Joi.array().items(ObjectIdMongodbValidator),
	isDeleted: Joi.boolean(),
	isDisplay: Joi.boolean(),
});

const querySchema = Joi.object({
	search: keySearchValidator,
	categoryId: Joi.alternatives(ObjectIdMongodbValidator, Joi.string().valid('all')),
	page: pageValidator,
	pagesize: pageSizeValidator,
	sort: sortValidator(SORTABLE_FIELDS),
	select: selectValidator(SELECT_FIELDS),
});

module.exports = {
	createSchema,
	updateSchema,
	querySchema,
};
