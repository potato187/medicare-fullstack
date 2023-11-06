import { emailValidator, passwordValidator, phoneValidator, requiredValidator } from 'admin/validators';
import { ADMIN_ROLE, GENDER_DEFAULT } from 'constant';
import * as yup from 'yup';

export const adminDefaultValues = {
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
	password: '',
	gender: GENDER_DEFAULT,
	role: ADMIN_ROLE,
};

export const createAdminSchema = yup.object().shape({
	firstName: requiredValidator,
	lastName: requiredValidator,
	email: emailValidator,
	phone: phoneValidator,
	password: passwordValidator,
});

export const updateAdminSchema = yup.object().shape({
	firstName: requiredValidator,
	lastName: requiredValidator,
	email: emailValidator,
	phone: phoneValidator,
});
