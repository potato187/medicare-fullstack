import { imageValidation, requiredValidation } from '@/admin/validation';
import * as yup from 'yup';

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

export const postSchema = yup.object().shape({
	title_en: requiredValidation,
	title_vi: requiredValidation,
	thumbnail: imageValidation,
});

export const postCategoryDefaultValues = {
	title_en: '',
	title_vi: '',
	display: true,
};

export const postCategorySchema = {
	title_en: requiredValidation,
	title_vi: requiredValidation,
};
