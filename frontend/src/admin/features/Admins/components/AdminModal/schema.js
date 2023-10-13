import * as yup from 'yup';
import { ADMIN_ROLE, GENDER_DEFAULT } from 'constant';
import { emailValidator, phoneValidator, requiredValidator } from 'admin/validators';

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
	firstName: requiredValidator,
	lastName: requiredValidator,
	email: emailValidator,
	phone: phoneValidator,
});
