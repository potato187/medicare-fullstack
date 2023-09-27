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

const createSchema = Joi.object({
	specialtyId: ObjectIdMongodbValidator,
	doctorId: ObjectIdMongodbValidator,
	workingHourId: ObjectIdMongodbValidator,
	appointmentDate: appointmentDateValidator.required(),
	fullName: nameValidator,
	phone: phoneValidator,
	dateOfBirth: dateOfBirthValidator.required(),
	gender: genderValidator,
	address: addressValidator,
	note: emptyStringValidator,
});

const updateSchema = Joi.object({
	specialtyId: ObjectIdMongodbValidator,
	doctorId: ObjectIdMongodbValidator,
	workingHourId: ObjectIdMongodbValidator,
	appointmentDate: appointmentDateValidator,
	fullName: nameValidator,
	phone: phoneValidator,
	dateOfBirth: dateOfBirthValidator,
	gender: genderValidator,
	address: addressValidator,
	note: emptyStringValidator,
	isDeleted: isDeletedValidator,
	status: enumWithDefaultValidator(BookingStatusOptions),
	description: Joi.string().allow(''),
});

const querySchema = Joi.object({
	specialtyId: ObjectIdMongodbValidator,
	doctorId: ObjectIdMongodbValidator,
	workingHourId: ObjectIdMongodbValidator,
	startDate: dateValidator,
	endDate: Joi.when('startDate', {
		is: Joi.exist(),
		then: dateValidator.greater(Joi.ref('startDate')).allow(''),
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
