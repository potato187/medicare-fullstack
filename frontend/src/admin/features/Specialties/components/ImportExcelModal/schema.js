import { emailValidation, phoneValidation, requiredValidation } from 'admin/validation';
import * as yup from 'yup';

export const IMPORT_STATUS = {
	PREPARE: 'PREPARE',
	SUCCESS: 'SUCCESS',
	FAIL: 'FAIL',
};

export const defaultValues = {
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
	address: '',
	gender: 'GM',
	position: 'P01',
	specialtyId: '',
	description: {
		vi: '',
		en: '',
	},
	importStatus: IMPORT_STATUS.PREPARE,
};

export const schema = yup.object().shape({
	doctors: yup.array().of(
		yup.object().shape({
			firstName: requiredValidation,
			lastName: requiredValidation,
			email: emailValidation,
			address: requiredValidation,
			phone: phoneValidation,
		}),
	),
});
