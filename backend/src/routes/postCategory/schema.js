'use strict';

const { slugValidator, emptyStringValidator, ObjectIdMongodbValidator } = require('@/validations');
const Joi = require('joi');

const nameValidator = Joi.string().min(3).max(250);

const createSchema = Joi.object({
	name: Joi.object({
		vi: nameValidator.required(),
		en: nameValidator.required(),
	}),
	slug: Joi.object({
		vi: slugValidator,
		en: slugValidator,
	}),
	description: Joi.object({
		vi: emptyStringValidator,
		en: emptyStringValidator,
	}),
	banner: emptyStringValidator,
	index: Joi.number().integer().positive().min(0).required(),
	parentId: ObjectIdMongodbValidator,
});

module.exports = {
	createSchema,
};
