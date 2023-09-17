const { UtilsRepo } = require('@/models/repository');
const { getInfoData, createUnSelectData, convertToObjectIdMongodb } = require('@/utils');
const { SPECIALTY_MODEL } = require('@/models/repository/constant');
const { SpecialtyBuilder } = require('./builder');

class SpecialtyService {
	static model = SPECIALTY_MODEL;

	static IGNORE_FIELDS = ['__v', 'updatedAt', 'createdAt', 'isDeleted', 'isActive'];

	static async createOne({ key, name, description, image }) {
		await UtilsRepo.checkConflicted({
			model: this.model,
			filter: { key },
			code: 400409,
		});

		const newSpecialty = await UtilsRepo.createOne({
			model: SPECIALTY_MODEL,
			body: new SpecialtyBuilder().setKey(key).setName(name).setDescription(description).setImage(image).build(),
		});

		return getInfoData({
			fields: ['_id', 'key', 'name', 'description', 'image'],
			object: newSpecialty,
		});
	}

	static async getAll() {
		const result = await UtilsRepo.getAll({
			model: SPECIALTY_MODEL,
			filter: { isDeleted: false, isActive: 'active' },
			sort: { key: 1 },
			select: createUnSelectData(SpecialtyService.IGNORE_FIELDS),
		});

		return result;
	}

	static async getOne(id) {
		const result = await UtilsRepo.findOne({
			model: SPECIALTY_MODEL,
			filter: { _id: convertToObjectIdMongodb(id) },
			select: createUnSelectData(SpecialtyService.IGNORE_FIELDS),
		});

		return result;
	}

	static async updateOne({ id, updateBody = {} }) {
		if (!Object.keys(updateBody).length) {
			return {};
		}

		const result = await UtilsRepo.findOneAndUpdate({
			model: SPECIALTY_MODEL,
			filter: { _id: convertToObjectIdMongodb(id) },
			updateBody,
			select: ['_id', 'key', 'name', 'slug', 'description', 'image'],
		});

		return result;
	}

	static async deleteOne(id) {
		const specialtyDeleted = await SpecialtyService.updateOne({
			id,
			updateBody: { isDeleted: true },
		});

		return {
			specialtyId: specialtyDeleted._id,
		};
	}
}

module.exports = SpecialtyService;
