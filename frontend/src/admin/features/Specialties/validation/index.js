import * as yup from 'yup';
import { emailValidation, phoneValidation, requiredValidation } from '@/admin/validation';

export const doctorDefaultValues = {
	id: '',
	first_name: '',
	last_name: '',
	email: '',
	phone: '',
	address: '',
	genderId: '',
	positionId: '',
	specialtyId: '',
	description: {
		en: '',
		vi: '',
	},
};

export const doctorValidation = yup.object().shape({
	first_name: requiredValidation,
	last_name: requiredValidation,
	email: emailValidation,
	phone: phoneValidation,
});
