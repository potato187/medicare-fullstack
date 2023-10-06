import * as yup from 'yup';
import { emailValidation, passwordValidation } from 'admin/validation';

export const defaultValues = {
	email: 'charlie.admin@example.com',
	password: 'S3cur3P@ssword',
};

export const schema = yup.object().shape({
	email: emailValidation,
	password: passwordValidation,
});
