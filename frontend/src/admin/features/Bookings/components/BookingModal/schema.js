import * as yup from 'yup';
import { phoneValidator, requiredValidator } from 'admin/validators';

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
	fullName: requiredValidator,
	phone: phoneValidator,
	doctorId: requiredValidator,
});
