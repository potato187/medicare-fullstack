'use strict';
const { CreatedResponse, OkResponse } = require('@/core');
const { BookingService } = require('@/services');

class BookingController {
	createOne = async (req, res, next) => {
		new CreatedResponse({
			metadata: await BookingService.createOne(req.body),
		}).send(res);
	};

	updateOneById = async (req, res, next) => {
		new OkResponse({
			metadata: await BookingService.updateOneById({
				id: req.params.id,
				updateBody: req.body,
			}),
		}).send(res);
	};

	deleteOneById = async (req, res, next) => {
		new OkResponse({
			metadata: await BookingService.deleteOneById(req.params.id),
		}).send(res);
	};
}

module.exports = new BookingController();
