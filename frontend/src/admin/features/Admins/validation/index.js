import { ADMIN_ROLE, GENDER_DEFAULT, POSITION_ADMIN_DEFAULT } from '@/admin/constant';
import { emailValidation, phoneValidation, requiredValidation } from '@/admin/validation';
import * as yup from 'yup';

export const adminDefaultValues = {
	first_name: '',
	last_name: '',
	email: '',
	phone: '',
	address: '',
	image: '',
	password: 'S3cur3P@ssword',
	genderId: GENDER_DEFAULT,
	roleId: ADMIN_ROLE,
	positionId: POSITION_ADMIN_DEFAULT,
};

export const adminValidation = yup.object().shape({
	first_name: requiredValidation,
	last_name: requiredValidation,
	email: emailValidation,
	phone: phoneValidation,
});
