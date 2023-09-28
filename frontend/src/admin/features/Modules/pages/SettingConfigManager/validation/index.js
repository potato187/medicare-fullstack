import { emailValidation, passwordValidation, phoneValidation, requiredValidation } from 'admin/validation';
import * as yup from 'yup';

export const settingConfigSchema = yup.object().shape({
	common_information: yup.object().shape({
		address: requiredValidation,
		logo_header: requiredValidation,
		logo_footer: requiredValidation,
		og_image: requiredValidation,
		favicon: requiredValidation,
		phone: phoneValidation,
		email: emailValidation,
	}),
	mail_server: yup.object().shape({
		email: emailValidation,
		password: passwordValidation,
	}),
});
