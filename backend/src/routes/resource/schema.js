'use strict';

const Joi = require('joi');

const modelSchema = Joi.object({
	model: Joi.string().valid('gender', 'role', 'specialty').required(),
});

const querySchema = Joi.object({
	sort: Joi.array()
		.items(
			Joi.array().ordered(
				Joi.string().valid('gender_key', 'role_key', 'key').default('ctime'),
				Joi.string().valid('asc', 'desc').default('asc'),
			),
		)
		.default([['ctime', 'asc']]),
	select: Joi.array().items(Joi.string().valid('_id', 'gender_name', 'gender_key', 'role_name', 'role_key', 'name')),
});

module.exports = {
	modelSchema,
	querySchema,
};
