/* eslint-disable no-unused-vars */
const { CreatedResponse, OkResponse } = require('@/core');
const { tryCatch } = require('@/middleware');
const { BookingService } = require('@/services');

class BookingController {
	getByQueryParams = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await BookingService.getByQueryParams(req.query),
		}).send(res);
	});

	getOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await BookingService.getOneById(req.params),
		}).send(res);
	});

	createOne = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			code: 600201,
			metadata: await BookingService.createOne(req.body),
		}).send(res);
	});

	updateOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			code: 600200,
			metadata: await BookingService.updateOneById({
				id: req.params.id,
				updateBody: req.body,
			}),
		}).send(res);
	});

	deleteOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			code: 601200,
			metadata: await BookingService.deleteOneById(req.params.id),
		}).send(res);
	});
}

module.exports = new BookingController();
