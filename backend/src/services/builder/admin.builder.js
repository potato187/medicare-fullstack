'use strict';
const { ROLES, GENDERS, STATUS } = require('@/constant');
const { ConflictRequestError, NotFoundRequestError, UnauthorizedRequestError } = require('@/core');
const { _AdminModel } = require('@/models');
const { AdminRepo } = require('@/models/repository');
const { getInfoData, createSelectData } = require('@/utils');
const bcrypt = require('bcrypt');

class AdminBuilder {
	constructor() {
		this.data = {
			firstName: '',
			lastName: '',
			phone: '',
			email: '',
			password: '',
			role: ROLES[1],
			gender: GENDERS[0],
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

	setPhone(phone) {
		this.data.phone = phone;
		return this;
	}

	setEmail(email) {
		this.data.email = email;
		return this;
	}

	setPassword(password) {
		this.data.password = password;
		return this;
	}

	setRole(role) {
		this.data.role = role;
		return this;
	}

	setGender(gender) {
		this.data.gender = gender;
		return this;
	}

	setIsDeleted(isDeleted = false) {
		this.data.isDeleted = isDeleted;
		return this;
	}

	setIsActive(isActive = 'active') {
		this.data.isActive = isActive;
		return this;
	}

	build() {
		return this.data;
	}

	comparePassword(password) {
		return bcrypt.compareSync(this.data.password, password);
	}

	async insertAndSelect(fields = []) {
		const data = this.build();
		const object = await AdminRepo.createAdmin(data);
		return getInfoData({ fields, object });
	}

	async find({ filter, select = [] }) {
		return await AdminRepo.findByFilter(filter, select);
	}
}

module.exports = AdminBuilder;
