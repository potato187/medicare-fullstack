const { GENDERS, STATUS, POSITIONS } = require('@/constant');
const { convertToObjectIdMongodb } = require('@/utils');

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
			position: POSITIONS[0],
			appointments: [],
			isDeleted: false,
			isActive: STATUS[0],
		};
	}

	setFirstName(firstName) {
		this.data.firstName = firstName;
		return this;
	}

	setLastName(lastName) {
		this.data.lastName = lastName;
		return this;
	}

	setGender(gender) {
		this.data.gender = gender;
		return this;
	}

	setEmail(email) {
		this.data.email = email;
		return this;
	}

	setPhone(phone) {
		this.data.phone = phone;
		return this;
	}

	setAddress(address) {
		this.data.address = address;
		return this;
	}

	setSpecialtyId(specialtyId) {
		this.data.specialtyId = convertToObjectIdMongodb(specialtyId);
		return this;
	}

	setPosition(position) {
		this.data.position = position;
		return this;
	}

	addAppointment(appointment) {
		this.data.appointments.push(appointment);
		return this;
	}

	setIsDeleted(isDeleted) {
		this.data.isDeleted = !!isDeleted;
		return this;
	}

	setIsActive(status) {
		this.data.isActive = STATUS.include(status) ? status : STATUS[0];
		return this;
	}

	getKeys() {
		return Object.keys(this.data);
	}

	build() {
		return this.data;
	}
}

module.exports = DoctorBuilder;
