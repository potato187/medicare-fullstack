const { UtilsRepo } = require('@/models/repository');
const { BOOKING_MODEL, WORKING_HOUR_MODEL, DOCTOR_MODEL } = require('@/models/repository/constant');
const { convertToObjectIdMongodb, getInfoData, createSearchData } = require('@/utils');
const { BadRequestError, NotFoundRequestError } = require('@/core');

const FIELDS_ABLE_SEARCH = ['fullName', 'phone', 'address', 'note'];

class BookingService {
	static model = BOOKING_MODEL;

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

	static async getByQueryParams(queryParams) {
		const { search, specialtyId, workingHourId, startDate, endDate, status, ...params } = queryParams;
		const match = { status };
		if (search) {
			match.$or = createSearchData(FIELDS_ABLE_SEARCH, search);
		}

		if (specialtyId) {
			match.specialtyId = convertToObjectIdMongodb(specialtyId);
		}

		if (workingHourId) {
			match.workingHourId = convertToObjectIdMongodb(workingHourId);
		}

		if (startDate) {
			match.appointmentDate = { ...match.appointmentDate, $gte: new Date(startDate) };
		}

		if (endDate) {
			match.appointmentDate = { ...match.appointmentDate, $lte: new Date(endDate) };
		}

		return UtilsRepo.getByQueryParams({
			model: BookingService.model,
			queryParams: { match, ...params },
		});
	}

	static async updateOneById({ id, updateBody }) {
		const { workingHourId, specialtyId, doctorId, dateOfBirth, appointmentDate, ...body } = updateBody;

		const select = Object.keys(updateBody);
		if (!select.length) return {};
		const { model } = BookingService;
		const filter = { _id: convertToObjectIdMongodb(id) };

		const foundBooking = await UtilsRepo.findOne({
			model,
			filter,
			select: ['specialtyId'],
		});

		if (!foundBooking) {
			throw new NotFoundRequestError();
		}

		if (workingHourId && workingHourId !== foundBooking.workingHourId) {
			await UtilsRepo.checkIsExist({
				model: WORKING_HOUR_MODEL,
				filter: { _id: convertToObjectIdMongodb(workingHourId) },
			});
			body.workingHourId = workingHourId;
		}

		if (specialtyId && !doctorId) {
			throw new BadRequestError();
		}

		if (specialtyId && doctorId) {
			await UtilsRepo.checkIsExist({
				model: DOCTOR_MODEL,
				filter: { _id: convertToObjectIdMongodb(doctorId), specialtyId: convertToObjectIdMongodb(specialtyId) },
			});

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
			model,
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
}

module.exports = BookingService;
