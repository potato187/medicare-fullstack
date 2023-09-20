const { POSITIONS } = require('@/constant');
const Joi = require('joi');
const { Types } = require('mongoose');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const phoneRegex = /^(84|0)[3|5|7|8|9]+([0-9]{8})\b/;
const adminRoleRegex = /(admin|mod)/;
const genderRegex = /(GF|GM|GO)/;
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const emailValidator = Joi.string().email({ minDomainSegments: 1, tlds: { allow: ['com'] } });

const passwordValidator = Joi.string().pattern(passwordRegex).message({
	'string.pattern.base': 'Password must be a strong password.',
});

const phoneValidator = Joi.string().pattern(phoneRegex).message({
	'string.pattern.base': 'Phone is invalid.',
});

const adminRoleValidator = Joi.string().pattern(adminRoleRegex).message({
	'string.pattern.base': 'Role is invalid',
});

const genderValidator = Joi.string().pattern(genderRegex).message({
	'string.pattern.base': 'Gender is invalid',
});

const ObjectIdMongodbValidator = Joi.string().custom((value, helper) =>
	Types.ObjectId.isValid(value) ? value : helper.message('107400'),
);

const summaryValidator = Joi.string().trim().max(100);

const nameValidator = Joi.string().trim().min(3).max(50);

const addressValidator = Joi.string().trim().min(3).max(150);

const emptyStringValidator = Joi.string().allow('');

const idSchema = Joi.object({
	id: ObjectIdMongodbValidator,
});

const isDeletedValidator = Joi.boolean();

const isVerify = Joi.boolean();

const booleanValidator = Joi.boolean();

const positionValidator = Joi.string().custom((value, helper) =>
	POSITIONS.includes(value) ? value : helper.message('108400'),
);

const dateValidator = Joi.date().iso();

const pageValidator = Joi.number().integer().positive().min(1).max(100).default(1);

const pageSizeValidator = Joi.number().integer().positive().min(1).max(100).default(25);

const keySearchValidator = Joi.string().allow('').default('');

const slugValidator = Joi.string().pattern(slugRegex);

const stringAllowEmpty = Joi.string().allow('');

const enumWithDefaultValidator = (fields = [], defaultValue = '') => {
	return Joi.string()
		.valid(...fields)
		.default(defaultValue || fields[0]);
};

const sortValidator = (fields = []) =>
	Joi.array().items(
		Joi.array()
			.length(2)
			.ordered(Joi.string().valid(...fields), Joi.string().valid('asc', 'desc')),
	);

const selectValidator = (fields = []) =>
	Joi.array()
		.items(Joi.string().valid(...fields))
		.default(fields);

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
};
