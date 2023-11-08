const {
	nameValidator,
	phoneValidator,
	ObjectIdMongodbValidator,
	genderValidator,
	addressValidator,
	isDeletedValidator,
	dateValidator,
	emptyStringValidator,
	pageValidator,
	pageSizeValidator,
	keySearchValidator,
	enumWithDefaultValidator,
	selectValidator,
	sortValidator,
} = require('@/validations');
const Joi = require('joi');
const { BookingStatusOptions, BookingStatusDefault, SelectFields, SortFields, SortDefaults } = require('./constant');

const appointmentDateValidator = dateValidator.min(new Date().setDate(new Date().getDate() + 1));
const dateOfBirthValidator = dateValidator.max(new Date().setDate(new Date().getDate() - 1));

const createSchema = Joi.object().keys({
	specialtyId: ObjectIdMongodbValidator.required(),
	doctorId: ObjectIdMongodbValidator.required(),
	workingHourId: ObjectIdMongodbValidator.required(),
	appointmentDate: appointmentDateValidator.required(),
	dateOfBirth: dateOfBirthValidator.required(),
	fullName: nameValidator.required(),
	phone: phoneValidator.required(),
	gender: genderValidator.required(),
	address: emptyStringValidator,
	description: emptyStringValidator,
});

const updateSchema = Joi.object({
	specialtyId: ObjectIdMongodbValidator,
	doctorId: ObjectIdMongodbValidator.when('specialtyId', {
		is: Joi.exist(),
		then: ObjectIdMongodbValidator,
		otherwise: Joi.optional(),
	}),
	workingHourId: ObjectIdMongodbValidator,
	appointmentDate: appointmentDateValidator.message('601400'),
	dateOfBirth: dateOfBirthValidator.message('602400'),
	fullName: nameValidator,
	phone: phoneValidator,
	gender: genderValidator,
	address: addressValidator,
	isDeleted: isDeletedValidator,
	status: enumWithDefaultValidator(BookingStatusOptions),
	description: emptyStringValidator,
});

const querySchema = Joi.object({
	specialtyId: ObjectIdMongodbValidator,
	doctorId: ObjectIdMongodbValidator,
	workingHourId: ObjectIdMongodbValidator,
	startDate: dateValidator,
	endDate: Joi.when('startDate', {
		is: Joi.exist(),
		then: dateValidator.greater(Joi.ref('startDate')).allow(''),
		otherwise: Joi.optional(),
	}),
	select: selectValidator(SelectFields),
	status: enumWithDefaultValidator(BookingStatusOptions, BookingStatusDefault),
	sort: sortValidator(SortFields, SortDefaults),
	page: pageValidator,
	pagesize: pageSizeValidator,
	search: keySearchValidator,
});

module.exports = {
	createSchema,
	updateSchema,
	querySchema,
};
