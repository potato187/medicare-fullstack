import { emailValidation, phoneValidation, requiredValidation } from '@/admin/validation';
import * as yup from 'yup';

export const bookingValidation = yup.object().shape({
	fullName: requiredValidation,
	email: emailValidation,
	phone: phoneValidation,
});
