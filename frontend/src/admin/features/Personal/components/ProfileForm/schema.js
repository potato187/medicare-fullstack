import { emailValidator, phoneValidator, requiredValidator } from 'admin/validators';
import * as yup from 'yup';

export const profileDefaultValues = {
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
	gender: 'GF',
};

export const profileSchema = yup.object().shape({
	firstName: requiredValidator,
	lastName: requiredValidator,
	email: emailValidator,
	phone: phoneValidator,
});
