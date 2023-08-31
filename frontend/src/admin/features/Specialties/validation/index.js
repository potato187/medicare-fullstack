import * as yup from 'yup';
import { emailValidation, phoneValidation, requiredValidation } from 'admin/validation';

export const doctorDefaultValues = {
	_id: '',
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
	address: '',
	gender: '',
	position: '',
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
