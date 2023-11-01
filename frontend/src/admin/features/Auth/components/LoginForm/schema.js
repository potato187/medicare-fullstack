import * as yup from 'yup';
import { emailValidator, passwordValidator } from 'admin/validators';

export const defaultValues = {
	email: 'charlie.admin@gmail.com',
	password: 'S3cur3P@ssword',
};

export const schema = yup.object().shape({
	email: emailValidator,
	password: passwordValidator,
});
