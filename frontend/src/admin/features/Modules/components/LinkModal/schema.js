import { requiredValidation } from 'admin/validation';
import * as yup from 'yup';

export const defaultValues = {
	name: {
		vi: '',
		en: '',
	},
	type: '',
	url: '',
	parentId: null,
	index: 0,
	isDisplay: false,
};

export const schema = yup.object({
	name: yup.object().shape({
		vi: requiredValidation,
		en: requiredValidation,
	}),
	url: requiredValidation,
});
