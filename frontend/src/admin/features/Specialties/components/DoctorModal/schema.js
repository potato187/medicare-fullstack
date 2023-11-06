import { emailValidator, phoneValidator, requiredValidator } from 'admin/validators';
import * as yup from 'yup';

export const defaultValues = {
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
	address: '',
	gender: 'GF',
	position: 'P01',
};

export const schema = yup.object().shape({
	firstName: requiredValidator,
	lastName: requiredValidator,
	email: emailValidator,
	phone: phoneValidator,
});
