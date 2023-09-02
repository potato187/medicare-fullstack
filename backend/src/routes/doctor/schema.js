'use strict';
const {
	genderValidator,
	emailValidator,
	phoneValidator,
	ObjectIdMongodbValidator,
	nameValidator,
	positionValidator,
} = require('@/validations');
const Joi = require('joi');

const descriptionValidate = Joi.object({
	vi: Joi.string().allow(''),
	en: Joi.string().allow(''),
});

const pageSizeValidate = Joi.number().integer().min(1).max(100).default(25);
const pageValidate = Joi.number().integer().min(1).max(100).default(1);

const doctorFieldValidate = Joi.string().valid(
	'_id',
	'firstName',
	'lastName',
	'email',
	'phone',
	'description',
	'gender',
	'position',
	'address',
	'specialtyId',
);

const selectValidate = Joi.alternatives()
	.try(doctorFieldValidate, Joi.array().items(doctorFieldValidate))
	.default(['_id', 'firstName', 'lastName', 'email', 'phone', 'specialtyId', 'position', 'gender', 'address']);

const sortValidate = Joi.array()
	.items(
		Joi.array().ordered(
			Joi.string().valid('createdAt', 'updatedAt', 'firstName', 'lastName', 'email', 'position').default('updatedAt'),
			Joi.string().valid('asc', 'desc').default('asc'),
		),
	)
	.default([
		['updatedAt', 'asc'],
		['position', 'asc'],
	]);

const createSchema = Joi.object({
	firstName: nameValidator.required(),
	lastName: nameValidator.required(),
	address: Joi.string().default(''),
	gender: genderValidator,
	email: emailValidator,
	phone: phoneValidator,
	specialtyId: ObjectIdMongodbValidator.required(),
	position: positionValidator,
	description: descriptionValidate,
});

const updateSchema = Joi.object({
	firstName: nameValidator,
	lastName: nameValidator,
	address: Joi.string(),
	gender: genderValidator,
	email: emailValidator,
	phone: phoneValidator,
	specialtyId: ObjectIdMongodbValidator,
	position: positionValidator,
	description: descriptionValidate,
	isActive: Joi.string().valid('active', 'inactive'),
});

const importSchema = Joi.array().items(createSchema).min(1);

const querySchema = Joi.object({
	specialtyId: ObjectIdMongodbValidator,
	key_search: Joi.string().allow('').default(''),
	page: pageValidate,
	pagesize: pageSizeValidate,
	sort: sortValidate,
	select: selectValidate,
});

const getOneSchema = Joi.object({
	select: selectValidate,
});

const exportSchema = Joi.object({
	type: Joi.string().valid('all', 'selected', 'page'),
	languageId: Joi.string().valid('en', 'vi').default('en'),
	specialtyId: Joi.when('type', {
		is: 'page',
		then: ObjectIdMongodbValidator,
		otherwise: Joi.forbidden(),
	}),
	page: Joi.when('type', {
		is: 'page',
		then: pageValidate,
	}),
	pagesize: Joi.when('type', {
		is: 'page',
		then: pageSizeValidate,
	}),

	ids: Joi.when('type', {
		is: 'selected',
		then: Joi.array().items(ObjectIdMongodbValidator).min(1),
		otherwise: Joi.forbidden(),
	}),
	sort: sortValidate,
});

module.exports = {
	querySchema,
	createSchema,
	updateSchema,
	importSchema,
	getOneSchema,
	exportSchema,
};
