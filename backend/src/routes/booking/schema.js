'use strict';
const {
	nameValidator,
	phoneValidator,
	ObjectIdMongodbValidator,
	genderValidator,
	addressValidator,
	isDeletedValidator,
	isVerify,
	dateValidator,
	emptyStringValidator,
} = require('@/validations');
const Joi = require('joi');
const { BookingStatusOptions, BookingStatusDefault, SelectFields, SortFields, SortDefaults } = require('./constant');

const sortDirections = ['asc', 'desc'];

const sortFieldValidator = Joi.array().ordered(
	Joi.string().valid(...SortFields),
	Joi.string().valid(...sortDirections),
);

const appointmentDateValidator = dateValidator.min(new Date().setDate(new Date().getDate() + 1));

const dateOfBirthValidator = dateValidator.max(new Date().setDate(new Date().getDate() - 1));

const sortValidator = Joi.array().items(sortFieldValidator).default(sortDirections);

const bookingSchema = Joi.object({
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

const updateBookingSchema = Joi.object({
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
	isVerify: isVerify,
	status: Joi.string().valid(...BookingStatusOptions),
});

const queryBookingSchema = Joi.object({
	specialtyId: ObjectIdMongodbValidator,
	doctorId: ObjectIdMongodbValidator,
	workingHourId: ObjectIdMongodbValidator,
	startDate: dateValidator,
	endDate: Joi.when('startDate', {
		is: Joi.exist(),
		then: dateValidator.greater(Joi.ref('startDate')).required(),
	}),
	select: Joi.array()
		.items(...SelectFields)
		.default(SelectFields),
	status: Joi.string()
		.valid(...BookingStatusOptions)
		.default(BookingStatusDefault),
	sort: sortValidator,
});

module.exports = {
	bookingSchema,
	updateBookingSchema,
	queryBookingSchema,
};
