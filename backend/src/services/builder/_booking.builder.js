const { GENDER_DEFAULT } = require('@/constant');

class BookingBuilder {
	constructor() {
		this.bookingData = {
			specialtyId: null,
			doctorId: null,
			workingHourId: null,
			appointmentDate: new Date(),
			status: 'pending',
			fullName: '',
			phone: '',
			dateOfBirth: new Date(),
			gender: GENDER_DEFAULT,
			address: '',
			note: '',
			isVerify: false,
			isDeleted: false,
		};
	}

	setSpecialtyId(specialtyId) {
		this.bookingData.specialtyId = specialtyId;
		return this;
	}

	setDoctorId(doctorId) {
		this.bookingData.doctorId = doctorId;
		return this;
	}

	setWorkingHourId(workingHourId) {
		this.bookingData.workingHourId = workingHourId;
		return this;
	}

	setAppointmentDate(appointmentDate) {
		this.bookingData.appointmentDate = appointmentDate;
		return this;
	}

	setStatus(status) {
		this.bookingData.status = status;
		return this;
	}

	setFullName(fullName) {
		this.bookingData.fullName = fullName;
		return this;
	}

	setPhone(phone) {
		this.bookingData.phone = phone;
		return this;
	}

	setDateOfBirth(dateOfBirth) {
		this.bookingData.dateOfBirth = dateOfBirth;
		return this;
	}

	setGender(gender) {
		this.bookingData.gender = gender;
		return this;
	}

	setAddress(address) {
		this.bookingData.address = address;
		return this;
	}

	setNote(note) {
		this.bookingData.note = note;
		return this;
	}

	setIsVerify(isVerify) {
		this.bookingData.isVerify = isVerify;
		return this;
	}

	setIsDeleted(isDeleted) {
		this.bookingData.isDeleted = isDeleted;
		return this;
	}

	build() {
		return this.bookingData;
	}
}

module.exports = BookingBuilder;
