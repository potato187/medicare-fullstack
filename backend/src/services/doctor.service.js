const { _DoctorModel } = require('@/models');
const { ConflictRequestError, NotFoundRequestError, InterServerRequestError } = require('@/core');
const { DOCTOR_MODEL, GENDER_MODEL, POSITION_MODEL, SPECIALLY_MODEL } = require('@/models/repository/constant');

const {
	getInfoData,
	convertToObjectIdMongodb,
	createSortData,
	createSearchData,
	createSelectData,
} = require('@/utils');
const { UtilsRepo } = require('@/models/repository');
const { DoctorBuilder } = require('./builder');

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

	static async updateOne({ id, updateBody }) {
		const filter = { _id: convertToObjectIdMongodb(id) };

		await DoctorService.checkIsExist(filter);

		const result = await UtilsRepo.findOneAndUpdate({
			model: DOCTOR_MODEL,
			filter,
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

	static async queryByParams({
		specialtyId = '',
		positionId = '',
		key_search: keySearch = '',
		sort = [],
		page = 1,
		pagesize = 25,
		select = [],
	}) {
		const filter = { isDeleted: false, isActive: 'active' };
		const $page = Math.max(1, +page);
		const $limit = pagesize > 0 && pagesize < 100 ? pagesize : 25;
		const $skip = ($page - 1) * $limit;
		const $sort = sort.length ? createSortData(sort) : { updateAt: 1 };

		if (specialtyId) {
			filter.specialtyId = convertToObjectIdMongodb(specialtyId);
		}

		if (positionId) {
			filter.positionId = convertToObjectIdMongodb(positionId);
		}

		if (keySearch) {
			filter.$or = createSearchData(FIELDS_ABLE_SEARCH, keySearch);
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
				keySearch,
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

	static async formatterExportData(doctors, languageId) {
		try {
			const [specialtiesResolve, gendersResolve, positionsResolve] = await Promise.all([
				UtilsRepo.getAll({
					model: SPECIALLY_MODEL,
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
			model: DOCTOR_MODEL,
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
