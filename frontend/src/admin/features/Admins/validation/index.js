import * as yup from 'yup';
import { ADMIN_ROLE, GENDER_DEFAULT } from '@/admin/constant';
import { emailValidation, phoneValidation, requiredValidation } from '@/admin/validation';

export const adminDefaultValues = {
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
	password: 'S3cur3P@ssword',
	gender: GENDER_DEFAULT,
	role: ADMIN_ROLE,
};

export const adminValidation = yup.object().shape({
	firstName: requiredValidation,
	lastName: requiredValidation,
	email: emailValidation,
	phone: phoneValidation,
});
