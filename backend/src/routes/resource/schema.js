'use strict';

const Joi = require('joi');

const modelSchema = Joi.object({
	model: Joi.string().valid('gender', 'role', 'specialty', 'workingHour', 'position').required(),
});

const querySchema = Joi.object({
	sort: Joi.array()
		.items(
			Joi.array().ordered(Joi.string().valid('key').default('ctime'), Joi.string().valid('asc', 'desc').default('asc')),
		)
		.default([['ctime', 'asc']]),
	select: Joi.array().items(Joi.string().valid('_id', 'key', 'name')),
});

const postSchema = Joi.array().items(
	Joi.object({
		key: Joi.string().alphanum().min(2).max(10),
		name: Joi.object({
			en: Joi.string().required(),
			vi: Joi.string().required(),
		}),
	}),
);

module.exports = {
	modelSchema,
	querySchema,
	postSchema,
};
