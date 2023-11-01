import { emailValidator, phoneValidator, requiredValidator } from 'admin/validators';
import * as yup from 'yup';

export const defaultValues = {};

export const schema = yup.object().shape({
	firstName: requiredValidator,
	lastName: requiredValidator,
	email: emailValidator,
	phone: phoneValidator,
});
