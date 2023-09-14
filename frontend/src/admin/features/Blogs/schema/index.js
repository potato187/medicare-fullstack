import * as yup from 'yup';
import { imageValidation, requiredValidation } from 'admin/validation';

export const postDefaultValues = {
	id: null,
	title_en: '',
	title_vi: '',
	thumbnail: '',
	shortDescription_vi: '',
	shortDescription_en: '',
	content_vi: '',
	content_en: '',
	publicDate: new Date(),
};

export const blogSchema = yup.object().shape({
	title_en: requiredValidation,
	title_vi: requiredValidation,
	thumbnail: imageValidation,
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
