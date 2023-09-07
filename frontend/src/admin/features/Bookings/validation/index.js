import * as yup from 'yup';
import { phoneValidation, requiredValidation } from 'admin/validation';

export const bookingValidation = yup.object().shape({
	fullName: requiredValidation,
	phone: phoneValidation,
});
