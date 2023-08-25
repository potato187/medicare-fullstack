import * as yup from 'yup';
import { isValidExtension, typeOf } from '@/utils';
import { PASSWORD_VALIDATION_REGEX, PHONE_VALIDATION_REGEX } from '../constant';

const isValidImageExtension = isValidExtension(['jpg', 'jpeg', 'png']);
const isValidExcelExtension = isValidExtension(['xlsx']);

export const requiredValidation = yup.string().required('form.message.error.required');

export const emailValidation = yup
	.string()
	.email('form.message.error.email_format')
	.required('form.message.error.required');

export const phoneValidation = yup.string().test('phone-validation', 'form.message.error.phone_format', (phone) => {
	return PHONE_VALIDATION_REGEX.test(phone);
});

export const passwordValidation = yup
	.string()
	.required('form.message.error.required')
	.test('weakPassword', 'form.message.error.password', (password) => {
		return PASSWORD_VALIDATION_REGEX.test(password);
	});

export const imageValidation = yup.mixed().test('imageExtension', 'form.message.error.media_extension', (file) => {
	if (!file || typeOf(file) === 'string') return true;
	return isValidImageExtension(file[0]?.name);
});

export const fileExcelValidation = yup
	.mixed()
	.required('form.message.error.required')
	.test('excelExtension', (file) => {
		if (!file || typeOf(file) === 'string') return true;
		return isValidExcelExtension(file[0]?.name);
	});

export const buildValidationForm = (data) => {
	return Object.keys(data).reduce((acc, key) => {
		if (typeOf(data[key]) !== 'object') {
			acc[key] = requiredValidation;
		} else {
			acc[key] = yup.object().shape(buildValidationForm(data[key]));
		}
		return acc;
	}, {});
};
