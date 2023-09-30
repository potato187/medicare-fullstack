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
	title: {
		vi: titleValidator.required(),
		en: titleValidator.required(),
	},
	slug: {
		vi: slugValidator.allow('').default(''),
		en: slugValidator.allow('').default(''),
	},
	summary: {
		vi: Joi.string().max(100).allow('').default(''),
		en: Joi.string().max(100).allow('').default(''),
	},
	content: {
		vi: Joi.string().allow('').default(''),
		en: Joi.string().allow('').default(''),
	},
	datePublished: dateValidator,
	blogCategoryIds: Joi.array().items(ObjectIdMongodbValidator),
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
