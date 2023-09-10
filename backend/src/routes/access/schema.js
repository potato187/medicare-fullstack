const {
	adminRoleValidator,
	emailValidator,
	genderValidator,
	nameValidator,
	passwordValidator,
	phoneValidator,
} = require('@/validations');
const Joi = require('joi');

const signUpSchema = Joi.object({
	firstName: nameValidator.required(),
	lastName: nameValidator.required(),
	email: emailValidator,
	phone: phoneValidator,
	password: passwordValidator,
	role: adminRoleValidator,
	gender: genderValidator,
});

const loginSchema = Joi.object({
	email: emailValidator,
	password: passwordValidator,
});

const refreshTokenSchema = Joi.object({
	refreshToken: Joi.string().required(),
});

module.exports = {
	loginSchema,
	refreshTokenSchema,
	signUpSchema,
};
