const { ObjectIdMongodbValidator } = require('@/validations');
const Joi = require('joi');

const modelSchema = Joi.object({
	model: Joi.string().valid('gender', 'role', 'specialty', 'doctor', 'workingHour', 'status', 'position').required(),
});

const querySchema = Joi.object({
	sort: Joi.array()
		.items(Joi.array().ordered(Joi.string().valid('key').default(''), Joi.string().valid('asc', 'desc').default('asc')))
		.default([['ctime', 'asc']]),
	select: Joi.array().items(Joi.string().valid('_id', 'key', 'name', 'firstName', 'lastName')),
	specialtyId: ObjectIdMongodbValidator,
});

const blogSchema = Joi.array().items(
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
	blogSchema,
};
