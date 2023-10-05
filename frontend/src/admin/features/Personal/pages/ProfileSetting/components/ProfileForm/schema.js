import { emailValidation, phoneValidation, requiredValidation } from 'admin/validation';
import * as yup from 'yup';

export const profileDefaultValues = {
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
	gender: 'GF',
};

export const profileSchema = yup.object().shape({
	firstName: requiredValidation,
	lastName: requiredValidation,
	email: emailValidation,
	phone: phoneValidation,
});
