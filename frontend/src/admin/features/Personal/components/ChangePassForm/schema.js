import { passwordConfirmValidator, passwordValidator } from 'admin/validators';
import * as yup from 'yup';

export const defaultValues = {
	password: 'S3cur3P@ssword',
	confirm_password: '',
	newPassword: '',
};

export const schema = yup.object().shape({
	password: passwordValidator,
	confirm_password: passwordConfirmValidator,
	newPassword: passwordValidator,
});
