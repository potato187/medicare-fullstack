const {
	adminRoleValidator,
	emailValidator,
	genderValidator,
	nameValidator,
	passwordValidator,
	phoneValidator,
	ObjectIdMongodbValidator,
	emptyStringValidator,
} = require('@/validations');
const Joi = require('joi');

const signUpSchema = Joi.object().keys({
	firstName: nameValidator.required(),
	lastName: nameValidator.required(),
	email: emailValidator.required(),
	phone: phoneValidator.required(),
	password: passwordValidator.required(),
	role: adminRoleValidator.required(),
	gender: genderValidator.required(),
	address: emptyStringValidator,
});

const loginSchema = Joi.object().keys({
	email: emailValidator.required(),
	password: passwordValidator.required(),
});

const refreshTokenSchema = Joi.object({
	refreshToken: Joi.string().required(),
});

const changePasswordSchema = Joi.object().keys({
	id: ObjectIdMongodbValidator.required(),
	password: passwordValidator.required(),
	newPassword: passwordValidator.required(),
});

module.exports = {
	loginSchema,
	refreshTokenSchema,
	signUpSchema,
	changePasswordSchema,
};
