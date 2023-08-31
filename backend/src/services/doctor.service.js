'use strict';
const { _DoctorModel } = require('@/models');
const { ConflictRequestError, NotFoundRequestError } = require('@/core');
const { DOCTOR_MODEL } = require('@/models/repository/constant');
const { DoctorBuilder } = require('./builder');
const {
	getInfoData,
	convertToObjectIdMongodb,
	createSortData,
	createSearchData,
	createSelectData,
} = require('@/utils');
const { UtilsRepo } = require('@/models/repository');

const FIELDS_ABLE_SEARCH = ['firstName', 'lastName', 'email', 'phone', 'address'];

class DoctorService {
	static async findByFilter(filter) {
		const doctor = await UtilsRepo.findOne({
			model: DOCTOR_MODEL,
			filter,
		});
		return doctor !== null;
	}

	static async checkIsExist(filter) {
		const doctor = await DoctorService.findByFilter(filter);
		if (!doctor) {
			throw new NotFoundRequestError({ code: 500404 });
		}
		return true;
	}

	static async checkIsConflict(filter) {
		const doctor = await DoctorService.findByFilter(filter);
		if (doctor) {
			throw new ConflictRequestError({ code: 500409 });
		}
		return true;
	}

	static async createOne(body) {
		const { firstName, lastName, gender, address, email, phone, specialtyId, positionId } = body;
		const doctorBuilder = new DoctorBuilder()
			.setFirstName(firstName)
			.setLastName(lastName)
			.setGender(gender)
			.setAddress(address)
			.setEmail(email)
			.setPhone(phone)
			.setSpecialtyId(specialtyId)
			.setPosition(positionId);

		await DoctorService.checkIsConflict({
			$or: [{ email: doctorBuilder.data.email }, { phone: doctorBuilder.data.phone }],
		});

		const newDoctor = await UtilsRepo.createOne({
			model: DOCTOR_MODEL,
			body: doctorBuilder.build(),
		});

		return getInfoData({
			fields: doctorBuilder.getKeys(),
			object: newDoctor,
		});
	}

	static async insertMany(uploadBody) {
		const doctorsStatus = uploadBody.map((item, index) => ({
			index,
			email: item.email,
			status: 'resolve',
		}));

		try {
			await _DoctorModel.insertMany(uploadBody, { ordered: false, lean: true });
		} catch (error) {
			error.writeErrors.forEach((err) => {
				doctorsStatus[err.index].status = 'reject';
			});
		}

		return {
			doctorsStatus,
		};
	}

	static async updateOne({ doctorId, updateBody }) {
		const filter = { _id: convertToObjectIdMongodb(doctorId) };

		await DoctorService.checkIsExist(filter);

		return await UtilsRepo.findOneAndUpdate({
			model: DOCTOR_MODEL,
			filter,
			updateBody,
			select: Object.keys(updateBody),
		});
	}

	static async deleteOne({ doctorId }) {
		return await DoctorService.updateOne({
			doctorId,
			updateBody: { isDeleted: true },
		});
	}

	static async queryByParams({
		specialtyId = '',
		positionId = '',
		key_search = '',
		sort = { updateAt: 'asc' },
		page = 1,
		pagesize = 25,
		select = [],
	}) {
		const filter = { isDeleted: false, isActive: 'active' };
		const $page = Math.max(1, +page);
		const $limit = pagesize > 0 && pagesize < 100 ? pagesize : 25;
		const $skip = ($page - 1) * $limit;
		const $sort = createSortData(sort);

		if (specialtyId) {
			filter.specialtyId = convertToObjectIdMongodb(specialtyId);
		}

		if (positionId) {
			filter.positionId = convertToObjectIdMongodb(positionId);
		}

		if (key_search) {
			filter.$or = createSearchData(FIELDS_ABLE_SEARCH, key_search);
		}

		const [{ results, total }] = await _DoctorModel
			.aggregate()
			.match(filter)
			.facet({
				results: [
					{ $sort },
					{ $skip },
					{ $limit },
					{
						$project: createSelectData(select),
					},
				],
				totalCount: [{ $count: 'count' }],
			})
			.sort({
				'position.order': 1,
			})
			.addFields({
				total: {
					$ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0],
				},
			})
			.project({
				results: 1,
				total: 1,
			});

		return {
			data: results,
			meta: {
				page: $page,
				pagesize: $limit,
				totalPages: Math.ceil(total / $limit) || 1,
				key_search,
			},
		};
	}

	static async getOne({ doctorId, select = ['_id'] }) {
		const doctor = await UtilsRepo.findOne({
			model: DOCTOR_MODEL,
			filter: { _id: convertToObjectIdMongodb(doctorId) },
			select,
		});

		return doctor;
	}
}

module.exports = DoctorService;
