import * as yup from 'yup';
import { phoneValidation, requiredValidation } from 'admin/validation';

export const bookingDefaultValues = {
	fullName: '',
	phone: '',
	address: '',
	gender: 'GF',
	status: 'pending',
	dateOfBirth: new Date(),
	appointmentDate: new Date(),
	workingHourId: '',
	specialtyId: '',
	doctorId: '',
};

export const bookingValidation = yup.object().shape({
	fullName: requiredValidation,
	phone: phoneValidation,
	doctorId: requiredValidation,
});
