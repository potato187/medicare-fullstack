import * as yup from 'yup';
import { emailValidation, phoneValidation, requiredValidation } from 'admin/validation';

export const doctorDefaultValues = {
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
	address: '',
	gender: 'GF',
	position: 'P01',
	specialtyId: '',
	description: {
		en: '',
		vi: '',
	},
};

export const doctorValidation = yup.object().shape({
	firstName: requiredValidation,
	lastName: requiredValidation,
	email: emailValidation,
	phone: phoneValidation,
});
