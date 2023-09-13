const { UtilsRepo } = require('@/models/repository');
const { BOOKING_MODEL, WORKING_HOUR_MODEL, DOCTOR_MODEL } = require('@/models/repository/constant');
const {
	convertToObjectIdMongodb,
	getInfoData,
	createSortData,
	createSelectData,
	createSearchData,
} = require('@/utils');
const { BadRequestError, NotFoundRequestError } = require('@/core');
const { _BookingModel } = require('@/models');

const FIELDS_ABLE_SEARCH = ['fullName', 'phone', 'address', 'note'];

class BookingService {
	static async findByFilter(filter, model = BOOKING_MODEL, select = ['_id']) {
		const result = await UtilsRepo.findOne({
			model,
			filter,
			select,
		});
		return result;
	}

	static async checkIsExist(filter, model = BOOKING_MODEL) {
		const result = await BookingService.findByFilter(filter, model);
		if (!result) {
			throw new NotFoundRequestError();
		}
		return !!result;
	}

	static async createOne(body) {
		const { specialtyId, doctorId, workingHourId } = body;

		const foundDoctor = await UtilsRepo.findOne({
			model: BOOKING_MODEL,
			filter: { _id: convertToObjectIdMongodb(doctorId), specialtyId: convertToObjectIdMongodb(specialtyId) },
		});

		const foundWK = await UtilsRepo.findOne({
			model: WORKING_HOUR_MODEL,
			filter: { _id: convertToObjectIdMongodb(workingHourId) },
		});

		if (!foundDoctor || !foundWK) {
			throw new BadRequestError();
		}

		const newBooking = await UtilsRepo.createOne({
			model: BOOKING_MODEL,
			body,
		});

		return getInfoData({
			fields: ['_id'],
			object: newBooking,
		});
	}

	static async updateOneById({ id, updateBody }) {
		const { workingHourId, specialtyId, doctorId, dateOfBirth, appointmentDate, ...body } = updateBody;

		const select = Object.keys(updateBody);
		if (!select.length) return {};

		const filter = { _id: convertToObjectIdMongodb(id) };

		const foundBooking = await BookingService.findByFilter(filter, BOOKING_MODEL, ['specialtyId']);

		if (!foundBooking) {
			throw new NotFoundRequestError();
		}

		if (workingHourId && workingHourId !== foundBooking.workingHourId) {
			await BookingService.checkIsExist({ _id: convertToObjectIdMongodb(workingHourId) }, WORKING_HOUR_MODEL);
			body.workingHourId = workingHourId;
		}

		if (specialtyId && !doctorId) {
			throw new BadRequestError();
		}

		if (specialtyId && doctorId) {
			await BookingService.checkIsExist(
				{ _id: convertToObjectIdMongodb(doctorId), specialtyId: convertToObjectIdMongodb(specialtyId) },
				DOCTOR_MODEL,
			);

			body.specialtyId = specialtyId;
			body.doctorId = doctorId;
		}

		if (dateOfBirth) {
			body.dateOfBirth = new Date(updateBody.dateOfBirth);
		}

		if (appointmentDate) {
			body.appointmentDate = new Date(updateBody.appointmentDate);
		}

		const result = await UtilsRepo.findOneAndUpdate({
			model: BOOKING_MODEL,
			filter,
			updateBody: body,
			select,
		});

		return result;
	}

	static async deleteOneById(id) {
		const result = await BookingService.updateOneById({ id, updateBody: { isDeleted: true } });
		return result;
	}

	static async queryByParams(parameters) {
		const {
			key_search: keySearch = '',
			specialtyId,
			workingHourId,
			startDate,
			endDate,
			sort,
			page = 1,
			pagesize = 25,
			status,
			select,
		} = parameters;

		const $sort = sort.length ? createSortData(sort) : { ctime: 1 };
		const $match = { isDeleted: false, status };
		const $skip = (page - 1) * pagesize;
		const $limit = pagesize;

		if (keySearch) {
			$match.$or = createSearchData(FIELDS_ABLE_SEARCH, keySearch);
		}

		if (specialtyId) {
			$match.specialtyId = convertToObjectIdMongodb(specialtyId);
		}

		if (workingHourId) {
			$match.workingHourId = convertToObjectIdMongodb(workingHourId);
		}

		if (startDate) {
			$match.appointmentDate = { ...$match.appointmentDate, $gte: new Date(startDate) };
		}

		if (endDate) {
			$match.appointmentDate = { ...$match.appointmentDate, $lte: new Date(endDate) };
		}

		const [{ results, total }] = await _BookingModel
			.aggregate()
			.match($match)
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
				page,
				pagesize: $limit,
				totalPages: Math.ceil(total / $limit) || 1,
			},
		};
	}
}

module.exports = BookingService;