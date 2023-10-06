import { passwordConfirmVallation, passwordValidation } from 'admin/validation';
import * as yup from 'yup';

export const defaultValues = {
	password: 'S3cur3P@ssword',
	confirm_password: '',
	newPassword: '',
};

export const schema = yup.object().shape({
	password: passwordValidation,
	confirm_password: passwordConfirmVallation,
	newPassword: passwordValidation,
});
