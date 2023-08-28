'use strict';
const Joi = require('joi');

const keyValidate = Joi.string().min(3).max(255);
const nameValidate = Joi.string().min(3).max(255);
const descriptionValidate = Joi.string().min(3).max(255);
const imageValidate = Joi.string().min(3).max(255);

const createSchema = Joi.object({
	key: keyValidate.required(),
	name: Joi.object({
		vi: nameValidate.required(),
		en: nameValidate.required(),
	}),
	description: Joi.object({
		vi: descriptionValidate.default(''),
		en: descriptionValidate.default(''),
	}),
	image: imageValidate.default(''),
});

const updateSchema = Joi.object({
	key: keyValidate,
	name: Joi.object({
		vi: nameValidate,
		en: nameValidate,
	}),
	description: Joi.object({
		vi: descriptionValidate,
		en: descriptionValidate,
	}),
	image: imageValidate,
	isActive: Joi.string().valid('active', 'inactive'),
});

module.exports = {
	createSchema,
	updateSchema,
};
