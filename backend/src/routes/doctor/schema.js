const Joi = require('joi');
const {
	genderValidator,
	emailValidator,
	phoneValidator,
	ObjectIdMongodbValidator,
	nameValidator,
	positionValidator,
	pageValidator,
	pageSizeValidator,
	sortValidator,
	selectValidator,
	enumWithDefaultValidator,
	stringAllowEmpty,
} = require('@/validations');
const { LANGUAGES } = require('@/constant');
const { SELECT_FIELDS, SORTABLE_FIELDS, EXPORT_TYPES } = require('./constant');

const selectValidate = selectValidator(SELECT_FIELDS);

const descriptionValidator = Joi.object({
	vi: stringAllowEmpty,
	en: stringAllowEmpty,
});

const createSchema = Joi.object().keys({
	firstName: nameValidator.required(),
	lastName: nameValidator.required(),
	gender: genderValidator.required(),
	email: emailValidator.required(),
	phone: phoneValidator.required(),
	specialtyId: ObjectIdMongodbValidator.required(),
	position: positionValidator.required(),
	address: stringAllowEmpty,
	description: descriptionValidator,
});

const updateSchema = Joi.object({
	firstName: nameValidator,
	lastName: nameValidator,
	address: stringAllowEmpty,
	gender: genderValidator,
	email: emailValidator,
	phone: phoneValidator,
	specialtyId: ObjectIdMongodbValidator,
	position: positionValidator,
	description: descriptionValidator,
	isActive: Joi.string().valid('active', 'inactive'),
});

const importSchema = Joi.object({
	doctors: Joi.array().items(createSchema).min(1),
});

const querySchema = Joi.object({
	specialtyId: ObjectIdMongodbValidator,
	positionId: ObjectIdMongodbValidator,
	search: Joi.string().allow('').default(''),
	page: pageValidator,
	pagesize: pageSizeValidator,
	sort: sortValidator(SORTABLE_FIELDS, [['position', 'asc']]),
	select: selectValidate,
});

const getOneSchema = Joi.object({
	select: selectValidate,
});

const exportSchema = Joi.object({
	type: enumWithDefaultValidator(EXPORT_TYPES, 'all'),
	languageId: enumWithDefaultValidator(LANGUAGES, 'en'),
	specialtyId: Joi.when('type', {
		is: 'page',
		then: ObjectIdMongodbValidator,
		otherwise: Joi.forbidden(),
	}),
	page: Joi.when('type', {
		is: 'page',
		then: pageValidator,
	}),
	pagesize: Joi.when('type', {
		is: 'page',
		then: pageSizeValidator,
	}),

	ids: Joi.when('type', {
		is: 'selected',
		then: Joi.array().items(ObjectIdMongodbValidator).min(1),
		otherwise: Joi.forbidden(),
	}),
	sort: selectValidate,
});

module.exports = {
	querySchema,
	createSchema,
	updateSchema,
	importSchema,
	getOneSchema,
	exportSchema,
};
