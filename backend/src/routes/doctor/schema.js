'use strict';
const {
	genderValidator,
	emailValidator,
	phoneValidator,
	ObjectIdMongodbValidator,
	nameValidator,
} = require('@/validations');
const Joi = require('joi');

const createSchema = Joi.object({
	firstName: nameValidator.required(),
	lastName: nameValidator.required(),
	address: Joi.string().default(''),
	gender: genderValidator,
	email: emailValidator,
	phone: phoneValidator,
	specialtyId: ObjectIdMongodbValidator.required(),
	positionId: ObjectIdMongodbValidator.required(),
});

const updateSchema = Joi.object({
	firstName: nameValidator,
	lastName: nameValidator,
	address: Joi.string(),
	gender: genderValidator,
	email: emailValidator,
	phone: phoneValidator,
	specialtyId: ObjectIdMongodbValidator,
	positionId: ObjectIdMongodbValidator,
	isActive: Joi.string().valid('active', 'inactive'),
});

const importSchema = Joi.array().items(createSchema).min(1);

const querySchema = Joi.object({
	specialtyId: ObjectIdMongodbValidator.required(),
	positionId: ObjectIdMongodbValidator,
	key_search: Joi.string().allow('').default(''),
	page: Joi.number().integer().min(1).max(100).default(1),
	pagesize: Joi.number().integer().min(1).max(100).default(25),
	sort: Joi.array()
		.items(
			Joi.array().ordered(
				Joi.string().valid('createdAt', 'updatedAt', 'firstName', 'lastName', 'email').default('updatedAt'),
				Joi.string().valid('asc', 'desc').default('asc'),
			),
		)
		.default([['updatedAt', 'asc']]),
	select: Joi.array()
		.items(Joi.string().valid('_id', 'firstName', 'lastName', 'email', 'phone'))
		.default(['_id', 'firstName', 'lastName', 'email', 'phone']),
});

module.exports = {
	querySchema,
	createSchema,
	updateSchema,
	importSchema,
};
