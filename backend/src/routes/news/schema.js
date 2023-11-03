const {
	PAGES,
	SORT_OPTIONS,
	SELECT_FIELDS,
	SORTABLE_FIELDS,
	QUERY_PAGE_POSITIONS,
} = require('@/constant/news.constant');
const {
	ObjectIdMongodbValidator,
	pageValidator,
	pageSizeValidator,
	sortValidator,
	enumWithDefaultValidator,
	fieldsValidator,
} = require('@/validations');
const Joi = require('joi');

const pageTypeValidator = fieldsValidator(PAGES);
const positionTypeValidator = enumWithDefaultValidator(QUERY_PAGE_POSITIONS);
const orderValidator = enumWithDefaultValidator(SORT_OPTIONS);
const indexValidator = Joi.number().integer().min(0);
const quantityValidator = Joi.number().integer().min(1);

const querySchema = Joi.object({
	page_type: pageTypeValidator,
	page_position: positionTypeValidator,
	sort: sortValidator(SORTABLE_FIELDS),
	select: fieldsValidator(SELECT_FIELDS, ['_id', 'name', 'positionType', 'index', 'isDisplay']),
	page: pageValidator,
	pagesize: pageSizeValidator,
});

const getOneSchema = Joi.object({
	select: fieldsValidator(SELECT_FIELDS, SELECT_FIELDS),
});

const createSchema = Joi.object().keys({
	name: Joi.object({
		vi: Joi.string().required(),
		en: Joi.string().required(),
	}),
	pageType: fieldsValidator(PAGES).required(),
	positionType: positionTypeValidator.required(),
	blogCategoryIds: Joi.array().items(ObjectIdMongodbValidator),
	order: orderValidator.required(),
	index: indexValidator.required(),
	quantity: quantityValidator.required(),
	isDisplay: Joi.boolean().required(),
});

const updateSchema = Joi.object({
	name: Joi.object({
		vi: Joi.string(),
		en: Joi.string(),
	}),
	pageType: pageTypeValidator,
	positionType: positionTypeValidator,
	blogCategoryIds: Joi.array().items(ObjectIdMongodbValidator),
	order: orderValidator,
	index: indexValidator,
	quantity: quantityValidator,
	isDisplay: Joi.boolean(),
});

module.exports = {
	querySchema,
	getOneSchema,
	createSchema,
	updateSchema,
};
