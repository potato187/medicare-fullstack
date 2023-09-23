import * as yup from 'yup';
import { requiredValidation } from 'admin/validation';

export const htmlContentDefaults = {
	_id: '',
	title: {
		vi: '',
		en: '',
	},
	content: {
		vi: '',
		en: '',
	},
	pageType: ['home'],
	positionType: 'main',
	index: 0,
	image: '',
	url: '',
};

export const htmlContentValidation = yup.object().shape({
	title: yup.object().shape({
		vi: requiredValidation,
		en: requiredValidation,
	}),
	pageType: yup.array().min(1, 'form.message.error.select_required').required(),
});
