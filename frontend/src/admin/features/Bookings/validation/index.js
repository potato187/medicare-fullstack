import * as yup from 'yup';
import { emailValidation, phoneValidation, requiredValidation } from 'admin/validation';

export const bookingValidation = yup.object().shape({
	fullName: requiredValidation,
	email: emailValidation,
	phone: phoneValidation,
});
