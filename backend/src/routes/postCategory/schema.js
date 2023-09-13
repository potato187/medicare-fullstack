const { ObjectIdMongodbValidator, selectValidator, booleanValidator, slugValidator } = require('@/validations');
const Joi = require('joi');

const SELECT_FIELDS = ['_id', 'name', 'slug', 'parentId', 'banner', 'display'];
const nameValidator = Joi.string().min(3).max(250);

const createSchema = Joi.object({
	name: Joi.object({
		vi: nameValidator.required(),
		en: nameValidator.required(),
	}),
	index: Joi.number().integer().integer().min(0).default(0),
	parentId: ObjectIdMongodbValidator.allow(null).default(null),
	display: booleanValidator.default(true),
});

const updateSchema = Joi.object({
	name: Joi.object({
		vi: nameValidator,
		en: nameValidator,
	}),
	slug: Joi.object({
		vi: slugValidator,
		en: slugValidator,
	}),
	display: booleanValidator,
});

const querySchema = Joi.object({
	select: selectValidator(SELECT_FIELDS),
});

const sortableSchema = Joi.array()
	.min(1)
	.items(
		Joi.object({
			id: ObjectIdMongodbValidator.required(),
			parentId: ObjectIdMongodbValidator.allow(null).default(null),
			index: Joi.number().integer().min(0).default(0),
		}),
	);

const deleteSchema = Joi.array()
	.min(1)
	.items(
		Joi.object({
			id: ObjectIdMongodbValidator,
		}),
	);

module.exports = {
	createSchema,
	updateSchema,
	sortableSchema,
	querySchema,
	deleteSchema,
};
