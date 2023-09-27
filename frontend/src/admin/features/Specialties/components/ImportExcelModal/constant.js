export const IMPORT_STATUS = {
	PREPARE: 'PREPARE',
	SUCCESS: 'SUCCESS',
	FAIL: 'FAIL',
};

export const doctorDefaultValue = {
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
