import * as yup from 'yup';
import { emailValidation, phoneValidation, requiredValidation } from 'admin/validation';

export const doctorValidation = yup.object().shape({
	firstName: requiredValidation,
	lastName: requiredValidation,
	email: emailValidation,
	phone: phoneValidation,
});
