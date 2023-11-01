const { UtilsRepo } = require('@/models/repository');
const { getInfoData, createUnSelectData, convertToObjectIdMongodb } = require('@/utils');
const { SPECIALTY_MODEL } = require('@/models/repository/constant');
const { SpecialtyBuilder } = require('./builder');

class SpecialtyService {
	static model = SPECIALTY_MODEL;

	static IGNORE_FIELDS = ['__v', 'updatedAt', 'createdAt', 'isDeleted', 'isActive'];

	static async createOne({ key, name, description, image }) {
		const { model } = SpecialtyService;
		await UtilsRepo.checkConflicted({
			model,
			filter: { key },
			code: 401409,
		});

		const newSpecialty = await UtilsRepo.createOne({
			model,
			body: new SpecialtyBuilder().setKey(key).setName(name).setDescription(description).setImage(image).build(),
		});

		return getInfoData({
			fields: ['_id', 'key', 'name', 'description', 'image'],
			object: newSpecialty,
		});
	}

	static async getAll() {
		const result = await UtilsRepo.getAll({
			model: SpecialtyService.model,
			filter: { isDeleted: false, isActive: 'active' },
			sort: { key: 1 },
			select: createUnSelectData(SpecialtyService.IGNORE_FIELDS),
		});

		return result;
	}

	static async getOne(id) {
		const result = await UtilsRepo.findOne({
			model: SpecialtyService.model,
			filter: { _id: convertToObjectIdMongodb(id) },
			select: createUnSelectData(SpecialtyService.IGNORE_FIELDS),
		});

		return result;
	}

	static async updateOne({ id, updateBody = {} }) {
		const select = Object.keys(updateBody);
		if (!select.length) {
			return {};
		}

		const result = await UtilsRepo.findOneAndUpdate({
			model: SpecialtyService.model,
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
