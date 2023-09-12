const { ObjectIdMongodbValidator, selectValidator, booleanValidator } = require('@/validations');
const Joi = require('joi');

const SELECT_FIELDS = ['_id', 'name', 'slug', 'parentId', 'banner', 'display'];
const nameValidator = Joi.string().min(3).max(250);

const createSchema = Joi.object({
	name: Joi.object({
		vi: nameValidator.required(),
		en: nameValidator.required(),
	}),
	index: Joi.number().integer().positive().min(0).required(),
	parentId: ObjectIdMongodbValidator.default(null),
	display: booleanValidator.default(true),
});

const querySchema = Joi.object({
	select: selectValidator(SELECT_FIELDS),
});

module.exports = {
	createSchema,
	querySchema,
};
