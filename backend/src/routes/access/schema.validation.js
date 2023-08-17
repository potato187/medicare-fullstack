'use strict';
const { textValidator, textAlphaValidator, emailValidator, passwordValidator } = require('@/validations');
const Joi = require('joi');

const signUpSchema = Joi.object({
	firstName: textAlphaValidator.label('First Name'),
	lastName: textAlphaValidator.label('Last Name'),
	email: emailValidator,
	password: passwordValidator,
	role_key: textValidator,
});

const loginSchema = Joi.object({
	email: emailValidator,
	password: passwordValidator,
});

const refreshTokenSchema = Joi.object({
	refreshToken: textValidator,
});

module.exports = {
	signUpSchema,
	loginSchema,
	refreshTokenSchema,
};
