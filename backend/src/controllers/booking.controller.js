const { CreatedResponse, OkResponse } = require('@/core');
const { tryCatch } = require('@/middleware');
const { BookingService } = require('@/services');

class BookingController {
	getByQueryParams = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await BookingService.getByQueryParams(req.query),
		}).send(res);
	});

	createOne = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			metadata: await BookingService.createOne(req.body),
		}).send(res);
	});

	updateOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await BookingService.updateOneById({
				id: req.params.id,
				updateBody: req.body,
			}),
		}).send(res);
	});

	deleteOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await BookingService.deleteOneById(req.params.id),
		}).send(res);
	});
}

module.exports = new BookingController();
