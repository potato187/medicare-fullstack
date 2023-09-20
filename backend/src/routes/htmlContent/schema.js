const { PAGES, PAGE_POSITIONS } = require('@/constant');
const {
	stringAllowEmpty,
	enumWithDefaultValidator,
	pageValidator,
	pageSizeValidator,
	sortValidator,
	selectValidator,
} = require('@/validations');
const Joi = require('joi');

const SORTABLE_FIELDS = [];
const SELECT_FIELDS = [];

const typePageValidator = enumWithDefaultValidator(PAGES);
const pagePotionsValidator = enumWithDefaultValidator(PAGE_POSITIONS);

const createSchema = {
	pageType: typePageValidator.required(),
	positionType: pagePotionsValidator.required(),
	index: Joi.number().integer().min(0).default(0).required(),
	title: {
		vi: Joi.string().required(),
		en: Joi.string().required(),
	},
	content: {
		vi: stringAllowEmpty,
		en: stringAllowEmpty,
	},
	url: stringAllowEmpty,
	image: stringAllowEmpty,
	icon: stringAllowEmpty,
};

const updateSchema = {
	pageType: typePageValidator,
	positionType: pagePotionsValidator,
	index: Joi.number().integer().min(0).default(0),
	title: {
		vi: Joi.string(),
		en: Joi.string(),
	},
	content: {
		vi: stringAllowEmpty,
		en: stringAllowEmpty,
	},
	url: stringAllowEmpty,
	image: stringAllowEmpty,
	icon: stringAllowEmpty,
};

const querySchema = {
	pageType: typePageValidator.required(),
	positionType: pagePotionsValidator.required(),
	sort: sortValidator(SORTABLE_FIELDS),
	select: selectValidator(SELECT_FIELDS),
	page: pageValidator,
	pageSize: pageSizeValidator,
};

module.exports = {
	createSchema,
	updateSchema,
	querySchema,
};
