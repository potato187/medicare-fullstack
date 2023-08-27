'use strict';
const { UtilsRepo } = require('@/models/repository');
const { SpecialtyBuilder } = require('./builder');
const { ConflictRequestError, NotFoundRequestError } = require('@/core');
const { getInfoData, createUnSelectData, convertToObjectIdMongodb } = require('@/utils');
const { SPECIALLY_MODEL } = require('@/models/repository/constant');
const { MONGODB_EXCLUDE_FIELDS } = require('@/constant');

class SpecialtyService {
	static async checkExists(filter) {
		const specialtyFound = await UtilsRepo.find({
			model: SPECIALLY_MODEL,
			filter,
		});

		return specialtyFound;
	}

	static async createOne({ key, name, description, image }) {
		const specialtyFound = await this.checkExists({ key });
		if (specialtyFound) {
			throw new ConflictRequestError({ code: 400409 });
		}

		const newSpecialty = await UtilsRepo.createOne({
			model: SPECIALLY_MODEL,
			body: new SpecialtyBuilder().setKey(key).setName(name).setDescription(description).setImage(image).build(),
		});

		return getInfoData({
			fields: ['_id', 'key', 'name', 'description', 'image'],
			object: newSpecialty,
		});
	}

	static async getAll() {
		return await UtilsRepo.getAll({
			model: SPECIALLY_MODEL,
			sort: [{ key: 1 }],
			select: createUnSelectData(MONGODB_EXCLUDE_FIELDS),
		});
	}

	static async getOne(id) {
		return await UtilsRepo.getAll({
			model: SPECIALLY_MODEL,
			filter: { _id: convertToObjectIdMongodb(id) },
			sort: [{ key: 1 }],
			select: createUnSelectData(MONGODB_EXCLUDE_FIELDS),
		});
	}

	static async updateOne({ id, updateBody }) {
		return await UtilsRepo.findByIdAndUpdate({
			model: SPECIALLY_MODEL,
			id,
			updateBody,
		});
	}

	static async deleteOne(id) {
		return await this.updateOne(id, { isDeleted: true });
	}
}

module.exports = SpecialtyService;
