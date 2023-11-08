const { POSITIONS } = require('@/constant');
const Joi = require('joi');
const { Types } = require('mongoose');

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const phoneRegex = /^(84|0)[35789][0-9]{0,8}\b/;
const adminRoleRegex = /(admin|mod)/;
const genderRegex = /(GF|GM|GO)/;
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const emailValidator = Joi.string().email({ minDomainSegments: 1, tlds: { allow: ['com'] } });

const passwordValidator = Joi.string().pattern(passwordRegex).message('100400');

const phoneValidator = Joi.string().pattern(phoneRegex).message('100400');

const adminRoleValidator = Joi.string().pattern(adminRoleRegex).message('100400');

const genderValidator = Joi.string().pattern(genderRegex).message('100400');

const ObjectIdMongodbValidator = Joi.string().custom((value, helper) =>
	Types.ObjectId.isValid(value) ? value : helper.message('100400'),
);

const summaryValidator = Joi.string().trim().max(100);

const nameValidator = Joi.string().trim().min(3).max(50);

const addressValidator = Joi.string().trim().min(3).max(150);

const emptyStringValidator = Joi.string().allow('');

const idSchema = Joi.object().keys({
	id: ObjectIdMongodbValidator,
});

const isDeletedValidator = Joi.boolean();

const isVerify = Joi.boolean();

const booleanValidator = Joi.boolean();

const positionValidator = Joi.string().custom((value, helper) => {
	return POSITIONS.includes(value) ? value : helper;
});

const dateValidator = Joi.date().iso();

const pageValidator = Joi.number().integer().positive().min(1).max(100).default(1);

const pageSizeValidator = Joi.number().integer().positive().min(25).max(100).default(25);

const keySearchValidator = Joi.string().allow('').default('');

const slugValidator = Joi.string().pattern(slugRegex);

const stringAllowEmpty = Joi.string().allow('');

const enumWithDefaultValidator = (fields = [], defaultValue = '') => {
	const validator = Joi.string().valid(...fields);
	return defaultValue ? validator.default(defaultValue) : validator;
};

const sortValidator = (fields = [], defaultValues = [['createdAt', 'asc']]) => {
	return Joi.array()
		.items(
			Joi.array()
				.length(2)
				.ordered(Joi.string().valid(...fields), Joi.string().valid('asc', 'desc')),
		)
		.empty(Joi.array().length(0))
		.default(defaultValues);
};

const selectValidator = (fields = []) => {
	return Joi.array()
		.items(Joi.string().valid(...fields))
		.empty(Joi.array().length(0))
		.default(fields);
};

const fieldsValidator = (fields = [], defaultValue = null) => {
	if (!defaultValue) {
		return Joi.array().items(Joi.string().valid(...fields));
	}

	return Joi.array()
		.items(Joi.string().valid(...fields))
		.empty(Joi.array().length(0))
		.default(defaultValue);
};

module.exports = {
	addressValidator,
	adminRoleValidator,
	emailValidator,
	genderValidator,
	idSchema,
	isDeletedValidator,
	isVerify,
	nameValidator,
	ObjectIdMongodbValidator,
	passwordValidator,
	phoneValidator,
	positionValidator,
	dateValidator,
	emptyStringValidator,
	pageValidator,
	pageSizeValidator,
	keySearchValidator,
	slugValidator,
	booleanValidator,
	summaryValidator,
	stringAllowEmpty,
	enumWithDefaultValidator,
	sortValidator,
	selectValidator,
	fieldsValidator,
};
