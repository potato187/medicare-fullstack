const { STATUS } = require('@/constant');

class SpecialtyBuilder {
	constructor() {
		this.data = {
			name: {
				vi: '',
				en: '',
			},
			description: {
				vi: '',
				en: '',
			},
			key: '',
			image: {},
			isActive: STATUS[0],
			isDeleted: false,
		};
	}

	setName(name = {}) {
		Object.assign(this.data.name, name);
		return this;
	}

	setDescription(description = {}) {
		Object.assign(this.data.description, description);
		return this;
	}

	setImage(image) {
		this.data.image = image;
		return this;
	}

	setActive(status = 'active') {
		this.data.isActive = status;
		return this;
	}

	setKey(key) {
		this.data.key = key;
		return this;
	}

	setIsDeleted(isDeleted) {
		this.data.isDeleted = isDeleted;
		return this;
	}

	build() {
		return this.data;
	}
}

module.exports = SpecialtyBuilder;
