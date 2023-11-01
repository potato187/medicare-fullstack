import { imageValidation, requiredValidator } from 'admin/validators';
import * as yup from 'yup';

export const defaultValues = {
	id: null,
	title: {
		vi: '',
		en: '',
	},
	summary: {
		vi: '',
		en: '',
	},
	content: {
		vi: '',
		en: '',
	},
	slug: {
		vi: '',
		en: '',
	},
	image: '',
	datePublished: new Date(),
};

export const schema = yup.object().shape({
	title: yup.object({
		vi: requiredValidator,
		en: requiredValidator,
	}),
	image: imageValidation,
});
