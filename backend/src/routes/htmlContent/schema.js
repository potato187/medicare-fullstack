const { PAGES, PAGE_POSITIONS } = require('@/constant');
const {
	stringAllowEmpty,
	enumWithDefaultValidator,
	pageValidator,
	pageSizeValidator,
	sortValidator,
	selectValidator,
	fieldsValidator,
} = require('@/validations');
const Joi = require('joi');

const SORTABLE_FIELDS = ['title', 'createdAt', 'index', 'positionType'];
const SELECT_FIELDS = ['title', 'index', 'isDisplay', 'createdAt', 'positionType'];

const pageTypesValidator = enumWithDefaultValidator(PAGES);
const pagePotionsValidator = enumWithDefaultValidator(PAGE_POSITIONS);

const createSchema = Joi.object().keys({
	pageType: fieldsValidator(PAGES).default(PAGES),
	positionType: pagePotionsValidator.default(PAGE_POSITIONS[0]),
	index: Joi.number().integer().min(0).default(0),
	title: Joi.object()
		.keys({
			vi: Joi.string().required(),
			en: Joi.string().required(),
		})
		.required(),
	content: Joi.object()
		.keys({
			vi: stringAllowEmpty,
			en: stringAllowEmpty,
		})
		.required(),
	url: stringAllowEmpty,
	image: stringAllowEmpty,
	icon: stringAllowEmpty,
});

const updateSchema = Joi.object({
	pageType: fieldsValidator(PAGES),
	positionType: pagePotionsValidator,
	index: Joi.number().integer().min(0),
	title: Joi.object({
		vi: Joi.string(),
		en: Joi.string(),
	}),
	content: Joi.object({
		vi: stringAllowEmpty,
		en: stringAllowEmpty,
	}),
	url: stringAllowEmpty,
	image: stringAllowEmpty,
	icon: stringAllowEmpty,
});

const querySchema = Joi.object({
	page_type: pageTypesValidator.required(),
	page_position: pagePotionsValidator.required(),
	sort: sortValidator(SORTABLE_FIELDS, [['index', 'asc']]),
	select: selectValidator(SELECT_FIELDS),
	page: pageValidator,
	pagesize: pageSizeValidator,
});

module.exports = {
	createSchema,
	updateSchema,
	querySchema,
};
