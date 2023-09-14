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
} = require('@/validations');
const Joi = require('joi');
const { BookingStatusOptions, BookingStatusDefault, SelectFields, SortFields } = require('./constant');

const sortDirections = ['asc', 'desc'];

const sortFieldValidator = Joi.array().ordered(
	Joi.string().valid(...SortFields),
	Joi.string().valid(...sortDirections),
);

const appointmentDateValidator = dateValidator.min(new Date().setDate(new Date().getDate() + 1));

const dateOfBirthValidator = dateValidator.max(new Date().setDate(new Date().getDate() - 1));

const sortValidator = Joi.array().items(sortFieldValidator).default(sortDirections);

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
	status: Joi.string().valid(...BookingStatusOptions),
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
	select: Joi.array()
		.items(...SelectFields)
		.default(SelectFields),
	status: Joi.string()
		.valid(...BookingStatusOptions)
		.default(BookingStatusDefault),
	sort: sortValidator,
	page: pageValidator,
	pagesize: pageSizeValidator,
	search: keySearchValidator,
});

module.exports = {
	createSchema,
	updateSchema,
	querySchema,
};
