import * as yup from 'yup';
import { phoneValidation, requiredValidation } from 'admin/validation';

export const defaultValues = {
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

export const schema = yup.object().shape({
	fullName: requiredValidation,
	phone: phoneValidation,
	doctorId: requiredValidation,
});
