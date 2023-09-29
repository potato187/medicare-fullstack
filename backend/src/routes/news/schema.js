const { PAGE_POSITIONS, PAGES, SORT_OPTIONS, SELECT_FIELDS, SORTABLE_FIELDS } = require('@/constant/news.constant');
const {
	enumWithDefaultValidator,
	ObjectIdMongodbValidator,
	fieldsValidator,
	pageValidator,
	pageSizeValidator,
	sortValidator,
} = require('@/validations');
const Joi = require('joi');

const pageTypeValidator = enumWithDefaultValidator(PAGES);
const positionTypeValidator = enumWithDefaultValidator(PAGE_POSITIONS);
const orderValidator = enumWithDefaultValidator(SORT_OPTIONS);
const indexValidator = Joi.number().integer().min(0);
const quantityValidator = Joi.number().integer().min(1);

const querySchema = Joi.object({
	pageType: pageTypeValidator,
	positionType: positionTypeValidator,
	sort: sortValidator(SORTABLE_FIELDS),
	select: fieldsValidator(SELECT_FIELDS, ['_id', 'name', 'positionType', 'index']),
	page: pageValidator,
	pageSize: pageSizeValidator,
});

const getOneSchema = Joi.object({
	select: fieldsValidator(SELECT_FIELDS, SELECT_FIELDS),
});

const createSchema = Joi.object({
	name: Joi.object({
		vi: Joi.string().required(),
		en: Joi.string().required(),
	}),
	pageType: pageTypeValidator.required(),
	positionType: positionTypeValidator.required(),
	blogCategoryIds: Joi.array().items(ObjectIdMongodbValidator),
	order: orderValidator.required(),
	index: indexValidator.required(),
	quantity: quantityValidator.required(),
});

const updateSchema = Joi.object({
	name: Joi.object({
		vi: Joi.string(),
		en: Joi.string(),
	}),
	pageType: pageTypeValidator,
	pagePosition: positionTypeValidator,
	blogCategoryIds: Joi.array().items(ObjectIdMongodbValidator),
	order: orderValidator,
	index: indexValidator,
	quantity: quantityValidator,
});

module.exports = {
	querySchema,
	getOneSchema,
	createSchema,
	updateSchema,
};
