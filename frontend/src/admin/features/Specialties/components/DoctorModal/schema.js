import { emailValidation, phoneValidation, requiredValidation } from 'admin/validation';
import * as yup from 'yup';

export const defaultValues = {};

export const schema = yup.object().shape({
	firstName: requiredValidation,
	lastName: requiredValidation,
	email: emailValidation,
	phone: phoneValidation,
});
