'use strict';

const { UtilsRepo } = require('@/models/repository');
const { SpecialtyBuilder } = require('./builder');
const { ConflictRequestError } = require('@/core');
const { getInfoData } = require('@/utils');

const MODEL_TYPE = 'specialty';

class SpecialtyService {
	static async insertOne({ key, name, description, image }) {
		const specialtyFound = await UtilsRepo.findOne({
			type: MODEL_TYPE,
			filter: { key },
		});

		if (specialtyFound) {
			throw new ConflictRequestError();
		}

		const specialtyBuilder = new SpecialtyBuilder()
			.setKey(key)
			.setName(name)
			.setDescription(description)
			.setImage(image)
			.build();

		const newSpecialty = await UtilsRepo.createOne({ type: MODEL_TYPE, body: specialtyBuilder });

		return getInfoData({
			fields: ['_id', 'key', 'name', 'description', 'image'],
			object: newSpecialty,
		});
	}
}

module.exports = SpecialtyService;
