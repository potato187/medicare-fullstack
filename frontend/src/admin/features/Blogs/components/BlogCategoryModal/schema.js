import * as yup from 'yup';
import { requiredValidator } from 'admin/validators';

export const defaultValues = {
	name: {
		vi: '',
		en: '',
	},
	isDisplay: true,
};

export const schema = yup.object().shape({
	name: yup.object().shape({
		vi: requiredValidator,
		en: requiredValidator,
	}),
});
