import { PASSWORD_VALIDATION_REGEX, PHONE_VALIDATION_REGEX } from 'constant';
import { isValidExtension } from 'utils';
import { typeOf } from 'utils/repos';
import * as yup from 'yup';

const isValidImageExtension = isValidExtension(['jpg', 'jpeg', 'png']);
const isValidExcelExtension = isValidExtension(['xlsx']);

export const requiredValidator = yup.string().required('form.message.error.required');

export const maxLengthValidation = yup
	.string()
	.test('len', 'form.message.error.maxLength', (value) => value.length <= 100);

export const emailValidator = yup
	.string()
	.email('form.message.error.email_format')
	.required('form.message.error.required');

export const phoneValidator = yup.string().test('phone-validation', 'form.message.error.phone_format', (phone) => {
	return PHONE_VALIDATION_REGEX.test(phone);
});

export const passwordValidator = yup
	.string()
	.required('form.message.error.required')
	.test('weakPassword', 'form.message.error.password', (password) => {
		return PASSWORD_VALIDATION_REGEX.test(password);
	});

export const passwordConfirmValidator = yup
	.string()
	.required('form.message.error.required')
	.oneOf([yup.ref('password')], 'form.message.error.matched');

export const imageValidation = yup.mixed().test('imageExtension', 'form.message.error.media_extension', (file) => {
	if (!file || typeOf(file) === 'string') return true;
	return isValidImageExtension(file[0]?.name);
});

export const fileExcelValidator = yup
	.mixed()
	.required('form.message.error.required')
	.test('excelExtension', (file) => {
		if (!file || typeOf(file) === 'string') return true;
		return isValidExcelExtension(file?.name || '');
	});

export const buildValidationForm = (data) => {
	return Object.keys(data).reduce((acc, key) => {
		if (typeOf(data[key]) !== 'object') {
			acc[key] = requiredValidator;
		} else {
			acc[key] = yup.object().shape(buildValidationForm(data[key]));
		}
		return acc;
	}, {});
};
