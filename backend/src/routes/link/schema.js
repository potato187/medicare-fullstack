const { LINK_TYPES } = require('@/constant');
const {
	ObjectIdMongodbValidator,
	booleanValidator,
	enumWithDefaultValidator,
	selectValidator,
} = require('@/validations');
const Joi = require('joi');

const SELECT_FIELDS = ['name', 'type', 'url', 'parentId', 'index', 'isDisplay'];

const validatedSelectFields = selectValidator(SELECT_FIELDS);

const createSchema = Joi.object().keys({
	name: Joi.object().keys({
		vi: Joi.string().required(),
		en: Joi.string().required(),
	}),
	url: Joi.string().required(),
	type: enumWithDefaultValidator(LINK_TYPES).required(),
	index: Joi.number().integer().min(0).required(),
	parentId: ObjectIdMongodbValidator.allow(null).default(null),
	isDisplay: booleanValidator.default(false),
});

const querySchema = Joi.object({
	type: enumWithDefaultValidator(LINK_TYPES).required(),
	select: validatedSelectFields,
});

const updateSchema = Joi.object({
	name: Joi.object({
		vi: Joi.string(),
		en: Joi.string(),
	}),
	url: Joi.string(),
	type: enumWithDefaultValidator(LINK_TYPES).required(),
	index: Joi.number().integer(),
	parentId: ObjectIdMongodbValidator.allow(null),
	isDisplay: booleanValidator,
	select: validatedSelectFields,
});

const sortableSchema = Joi.array()
	.min(1)
	.items(
		Joi.object({
			id: ObjectIdMongodbValidator.required(),
			index: Joi.number().integer().min(0).required(),
			parentId: ObjectIdMongodbValidator.allow(null).required(),
		}),
	);

const deleteMultiSchema = Joi.object({
	type: enumWithDefaultValidator(LINK_TYPES).required(),
	select: selectValidator(SELECT_FIELDS),
	listId: Joi.array().min(1).items(ObjectIdMongodbValidator),
});

module.exports = {
	createSchema,
	querySchema,
	updateSchema,
	sortableSchema,
	deleteMultiSchema,
};
