const { _DoctorModel } = require('@/models');
const { InterServerRequestError } = require('@/core');
const { DOCTOR_MODEL, GENDER_MODEL, POSITION_MODEL, SPECIALTY_MODEL } = require('@/models/repository/constant');
const { getInfoData, convertToObjectIdMongodb, createSortData, createSearchData } = require('@/utils');
const { UtilsRepo } = require('@/models/repository');

const FIELDS_ABLE_SEARCH = ['firstName', 'lastName', 'email', 'phone', 'address'];

class DoctorService {
	static model = DOCTOR_MODEL;

	static async createOne(body) {
		const { email, phone } = body;
		const { model } = DoctorService;

		await UtilsRepo.checkConflicted({
			model,
			filter: { $or: [{ email }, { phone }] },
			code: 400409,
		});

		const newDoctor = await UtilsRepo.createOne({
			model,
			body,
		});

		return getInfoData({
			fields: [...Object.keys(body), '_id'],
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

	static async updateOne({ id, updateBody }) {
		const fields = Object.keys(updateBody);
		if (!fields.length) return {};

		const { model } = DoctorService;
		const _id = convertToObjectIdMongodb(id);
		const filterById = { _id };
		await UtilsRepo.checkIsExist({
			model,
			filter: filterById,
			code: 400404,
		});

		if (updateBody?.email || updateBody?.phone) {
			const filter = {
				$and: [
					{
						_id: { $ne: _id },
					},
					{
						$or: [],
					},
				],
			};

			const { email, phone } = updateBody;
			if (email) filter.$and[1].$or.push({ email });
			if (phone) filter.$and[1].$or.push({ phone });

			await UtilsRepo.checkConflictedWithObjectId({
				model,
				filter,
				objectId: _id,
				code: 402409,
			});
		}

		const result = await UtilsRepo.findOneAndUpdate({
			model: DoctorService.model,
			filter: filterById,
			updateBody,
			select: Object.keys(updateBody),
		});

		return result;
	}

	static async deleteOne({ id }) {
		const result = await DoctorService.updateOne({
			id,
			updateBody: { isDeleted: true },
		});

		return result;
	}

	static async getByQueryParams(queryParams) {
		const { specialtyId = '', positionId = '', search, ...params } = queryParams;
		const match = { isDeleted: false, isActive: 'active' };

		if (specialtyId) {
			match.specialtyId = convertToObjectIdMongodb(specialtyId);
		}

		if (positionId) {
			match.positionId = convertToObjectIdMongodb(positionId);
		}

		if (search) {
			match.$or = createSearchData(FIELDS_ABLE_SEARCH, search);
		}

		return UtilsRepo.getByQueryParams({
			model: DoctorService.model,
			queryParams: { match, ...params },
		});
	}

	static async getOne({ doctorId, select = ['_id'] }) {
		const doctor = await UtilsRepo.findOne({
			model: DoctorService.model,
			filter: { _id: convertToObjectIdMongodb(doctorId) },
			select,
		});

		return doctor;
	}

	static async formatterExportData(doctors, languageId) {
		try {
			const [specialtiesResolve, gendersResolve, positionsResolve] = await Promise.all([
				UtilsRepo.getAll({
					model: SPECIALTY_MODEL,
					select: ['_id', 'name'],
				}),
				UtilsRepo.getAll({
					model: GENDER_MODEL,
					select: ['key', 'name'],
				}),
				UtilsRepo.getAll({
					model: POSITION_MODEL,
					select: ['key', 'name'],
				}),
			]);
			const specialties = specialtiesResolve.reduce(
				(object, { _id, name }) => ({ ...object, [_id]: name[languageId] }),
				{},
			);

			const genders = gendersResolve.reduce((object, { key, name }) => ({ ...object, [key]: name[languageId] }), {});

			const positions = positionsResolve.reduce(
				(object, { key, name }) => ({ ...object, [key]: name[languageId] }),
				{},
			);

			return doctors.map((doctor) => ({
				fullName: `${doctor.lastName} ${doctor.firstName}`,
				email: doctor.email,
				phone: doctor.phone,
				address: doctor.address,
				gender: genders[doctor.gender] ?? '',
				specialty: specialties[doctor.specialtyId] ?? '',
				position: positions[doctor.position] ?? '',
			}));
		} catch (error) {
			throw new InterServerRequestError();
		}
	}

	static async getDoctorsBySpecialty({ specialtyId = '', sort, page = 1, pagesize = 25 }) {
		const skip = (page - 1) * pagesize;
		const result = await _DoctorModel
			.find({ specialtyId: convertToObjectIdMongodb(specialtyId), isDeleted: false })
			.sort(sort)
			.skip(skip)
			.limit(pagesize)
			.lean();

		return result;
	}

	static async getDoctorByFilter({ filter, sort, select }) {
		const result = await UtilsRepo.getAll({
			model: DoctorService.model,
			query: filter,
			sort,
			select,
		});

		return result;
	}

	static async export({ type, sort, ...rest }) {
		let doctors = [];
		const $sort = createSortData(sort);
		const select = ['-updatedAt', '-createdAt', '-description', '-appointments', '-__v'];
		const filter = { isDeleted: false };

		switch (type) {
			case 'selected':
				filter._id = { $in: rest.ids };
				doctors = await DoctorService.getDoctorByFilter({ filter, sort: $sort, select });
				break;
			case 'page':
				doctors = await DoctorService.getDoctorsBySpecialty({ sort: $sort, ...rest });
				break;
			default:
				doctors = await DoctorService.getDoctorByFilter({ filter, sort: $sort, select });
				break;
		}

		const result = await DoctorService.formatterExportData(doctors, rest.languageId);

		return result;
	}
}

module.exports = DoctorService;
