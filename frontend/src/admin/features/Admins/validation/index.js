import { ADMIN_ROLE, GENDER_DEFAULT, POSITION_ADMIN_DEFAULT } from '@/admin/constant';
import { emailValidation, phoneValidation, requiredValidation } from '@/admin/validation';
import * as yup from 'yup';

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
