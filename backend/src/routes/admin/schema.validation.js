'use strict';
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

module.exports = {
	querySchema,
};
