import * as yup from 'yup';
import { imageValidation, requiredValidation } from 'admin/validation';

export const htmlContentDefaults = {
	title_vi: '',
	title_en: '',
	content_vi: '',
	content_en: '',
	image: '',
	url: '',
	pageId: 'HMP',
	typePositionId: 'TP',
	index: 0,
};

export const htmlContentValidation = yup.object().shape({
	title_vi: requiredValidation,
	title_en: requiredValidation,
	index: requiredValidation,
	image: imageValidation,
});
