import { emailValidator, passwordValidator, phoneValidator, requiredValidator } from 'admin/validators';
import * as yup from 'yup';

export const settingConfigSchema = yup.object().shape({
	common_information: yup.object().shape({
		address: requiredValidator,
		logo_header: requiredValidator,
		logo_footer: requiredValidator,
		og_image: requiredValidator,
		favicon: requiredValidator,
		phone: phoneValidator,
		email: emailValidator,
	}),
	mail_server: yup.object().shape({
		email: emailValidator,
		password: passwordValidator,
	}),
});
