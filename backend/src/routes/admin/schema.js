'use strict';
const {
	nameValidator,
	emailValidator,
	phoneValidator,
	passwordValidator,
	adminRoleValidator,
	genderValidator,
	ObjectIdMongodbValidator,
} = require('@/validations');
const Joi = require('joi');

const querySchema = Joi.object({
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

const updateSchema = Joi.object({
	firstName: nameValidator,
	lastName: nameValidator,
	email: emailValidator,
	phone: phoneValidator,
	password: passwordValidator,
	role: adminRoleValidator,
	gender: genderValidator,
});

const paramsSchema = Joi.object({
	id: ObjectIdMongodbValidator,
});

module.exports = {
	paramsSchema,
	querySchema,
	updateSchema,
};
