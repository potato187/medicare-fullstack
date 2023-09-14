const {
	nameValidator,
	emailValidator,
	phoneValidator,
	passwordValidator,
	adminRoleValidator,
	genderValidator,
	ObjectIdMongodbValidator,
	sortValidator,
	selectValidator,
} = require('@/validations');
const Joi = require('joi');

const SELECT_FIELDS = ['_id', 'firstName', 'lastName', 'email', 'phone', 'role'];
const SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'firstName', 'lastName', 'email'];

const querySchema = Joi.object({
	search: Joi.string().allow('').default(''),
	page: Joi.number().integer().min(1).max(100).default(1),
	pagesize: Joi.number().integer().min(1).max(100).default(25),
	sort: sortValidator(SORTABLE_FIELDS),
	select: selectValidator(SELECT_FIELDS),
});

const updateSchema = Joi.object({
	firstName: nameValidator,
	lastName: nameValidator,
	email: emailValidator,
	phone: phoneValidator,
	password: passwordValidator,
	role: adminRoleValidator,
	gender: genderValidator,
});

const paramsSchema = Joi.object({
	id: ObjectIdMongodbValidator,
});

module.exports = {
	paramsSchema,
	querySchema,
	updateSchema,
};
