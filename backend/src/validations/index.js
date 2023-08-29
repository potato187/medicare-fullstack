'use strict';
const Joi = require('joi');
const { Types } = require('mongoose');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const phoneRegex = /^(84|0)[3|5|7|8|9]+([0-9]{8})\b/;
const adminRoleRegex = /(admin|mod)/;
const genderRegex = /(GF|GM|GO)/;

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

const ObjectIdMongodbValidator = Joi.string().custom((value, helper) => {
	return Types.ObjectId.isValid(value) ? value : helper.message('107400');
});

const nameValidator = Joi.string().trim().min(3).max(50);
const addressValidator = Joi.string().trim().min(3).max(150);

const idSchema = Joi.object({
	id: ObjectIdMongodbValidator,
});

module.exports = {
	addressValidator,
	adminRoleValidator,
	emailValidator,
	genderValidator,
	idSchema,
	nameValidator,
	ObjectIdMongodbValidator,
	passwordValidator,
	phoneValidator,
};
