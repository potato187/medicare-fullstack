'use strict';

const { GENDERS } = require('@/constant');

class DoctorBuilder {
	constructor() {
		this.data = {
			firstName: '',
			lastName: '',
			gender: GENDERS[0],
			email: '',
			phone: '',
			address: '',
			specialtyId: '',
		};
	}
}
