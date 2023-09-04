'use strict';
const { UtilsRepo } = require('@/models/repository');
const { BOOKING_MODEL, WORKING_HOUR_MODEL, SPECIALLY_MODEL, DOCTOR_MODEL } = require('@/models/repository/constant');
const { convertToObjectIdMongodb, getInfoData } = require('@/utils');
const { BadRequestError, NotFoundRequestError } = require('@/core');

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
		const { specialtyId, doctorId, workingHourId, appointmentDate } = body;

		const foundDoctor = new UtilsRepo.findOne({
			model: BOOKING_MODEL,
			filter: { _id: convertToObjectIdMongodb(doctorId), specialtyId: convertToObjectIdMongodb(specialtyId) },
		});

		const foundWK = new UtilsRepo.findOne({
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
		const { workingHourId, specialtyId, doctorId } = updateBody;
		const filter = { _id: convertToObjectIdMongodb(id) };

		const foundBooking = await BookingService.findByFilter(filter, BOOKING_MODEL, ['specialtyId']);

		if (!foundBooking) {
			throw new NotFoundRequestError();
		}

		if (workingHourId && workingHourId !== foundBooking.workingHourId) {
			const filter = { _id: convertToObjectIdMongodb(workingHourId) };
			await BookingService.checkIsExist(filter, WORKING_HOUR_MODEL);
		}

		if ((specialtyId && !doctorId) || (!specialtyId && doctorId)) {
			throw new BadRequestError();
		}

		if (specialtyId && doctorId) {
			const filter = { _id: convertToObjectIdMongodb(doctorId), specialtyId: convertToObjectIdMongodb(specialtyId) };
			await BookingService.checkIsExist(filter, DOCTOR_MODEL);
		}

		return await UtilsRepo.findOneAndUpdate({
			model: BOOKING_MODEL,
			filter,
			updateBody,
		});
	}

	static async deleteOneById(id) {
		return await BookingService.updateOneById({ id, updateBody: { isDeleted: true } });
	}
}

module.exports = BookingService;
