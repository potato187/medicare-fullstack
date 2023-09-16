import { imageValidation, requiredValidation } from 'admin/validation';
import * as yup from 'yup';

export const blogDefaultValues = {
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

export const blogSchema = yup.object().shape({
	title: yup.object({
		vi: requiredValidation,
		en: requiredValidation,
	}),
	image: imageValidation,
});

export const blogCategoryDefaultValues = {
	name: {
		vi: '',
		en: '',
	},
	display: true,
};

export const blogCategoryDefault = {
	name: {
		vi: '',
		en: '',
	},
	slug: {
		vi: '',
		en: '',
	},
	url: {
		vi: '',
		en: '',
	},
};

export const blogCategorySchema = yup.object().shape({
	name: yup.object().shape({
		vi: requiredValidation,
		en: requiredValidation,
	}),
});
