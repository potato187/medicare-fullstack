import * as yup from 'yup';
import { requiredValidation } from 'admin/validation';

export const defaultValues = {
	name: {
		vi: '',
		en: '',
	},
	isDisplay: true,
};

export const schema = yup.object().shape({
	name: yup.object().shape({
		vi: requiredValidation,
		en: requiredValidation,
	}),
});
