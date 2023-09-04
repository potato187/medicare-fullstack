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
	gender: '',
	position: '',
	specialtyId: '',
	importStatus: IMPORT_STATUS.PREPARE,
};
