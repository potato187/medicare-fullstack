'use strict';
const {
	emailValidator,
	passwordValidator,
	phoneValidator,
	adminRoleValidator,
	nameValidator,
} = require('@/validations');
const Joi = require('joi');

const signUpSchema = Joi.object({
	firstName: nameValidator,
	lastName: nameValidator,
	email: emailValidator,
	phone: phoneValidator,
	password: passwordValidator,
	role: adminRoleValidator,
});

const loginSchema = Joi.object({
	email: emailValidator,
	password: passwordValidator,
});

const refreshTokenSchema = Joi.object({
	refreshToken: Joi.string().required(),
});

module.exports = {
	signUpSchema,
	loginSchema,
	refreshTokenSchema,
};
