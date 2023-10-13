import { requiredValidator } from 'admin/validators';
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
		vi: requiredValidator,
		en: requiredValidator,
	}),
	url: requiredValidator,
});
