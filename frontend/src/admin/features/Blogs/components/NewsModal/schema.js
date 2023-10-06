import { requiredValidation } from 'admin/validation';
import * as yup from 'yup';

export const defaultValues = {
	name: {
		vi: '',
		en: '',
	},
	pageType: ['home'],
	positionType: 'main',
	index: 0,
	quantity: 1,
	order: 'createdAt_desc',
	isDisplay: false,
};

export const schema = yup.object().shape({
	name: yup.object().shape({
		vi: requiredValidation,
		en: requiredValidation,
	}),
});
