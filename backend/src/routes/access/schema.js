const {
	adminRoleValidator,
	emailValidator,
	genderValidator,
	nameValidator,
	passwordValidator,
	phoneValidator,
	ObjectIdMongodbValidator,
} = require('@/validations');
const Joi = require('joi');

const signUpSchema = Joi.object().keys({
	firstName: nameValidator.required(),
	lastName: nameValidator.required(),
	email: emailValidator,
	phone: phoneValidator,
	password: passwordValidator,
	role: adminRoleValidator,
	gender: genderValidator,
});

const loginSchema = Joi.object().keys({
	email: emailValidator,
	password: passwordValidator,
});

const refreshTokenSchema = Joi.object({
	refreshToken: Joi.string().required(),
});

const changePasswordSchema = Joi.object().keys({
	id: ObjectIdMongodbValidator,
	password: passwordValidator,
	newPassword: passwordValidator,
});

module.exports = {
	loginSchema,
	refreshTokenSchema,
	signUpSchema,
	changePasswordSchema,
};
