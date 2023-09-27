const {
	nameValidator,
	emailValidator,
	phoneValidator,
	passwordValidator,
	adminRoleValidator,
	genderValidator,
	pageValidator,
	pageSizeValidator,
	sortValidator,
	fieldsValidator,
} = require('@/validations');
const Joi = require('joi');

const SELECT_FIELDS = ['_id', 'firstName', 'lastName', 'email', 'phone', 'role', 'address', 'gender'];
const SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'firstName', 'lastName', 'email'];

const querySchema = Joi.object({
	search: Joi.string().default(''),
	page: pageValidator,
	pagesize: pageSizeValidator,
	sort: sortValidator(SORTABLE_FIELDS, [['createdAt', 'asc']]),
	select: fieldsValidator(SELECT_FIELDS, ['_id', 'firstName', 'lastName', 'phone', 'email']),
});

const getOneSchema = Joi.object({
	select: fieldsValidator(SELECT_FIELDS, SELECT_FIELDS),
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

module.exports = {
	querySchema,
	getOneSchema,
	updateSchema,
};
