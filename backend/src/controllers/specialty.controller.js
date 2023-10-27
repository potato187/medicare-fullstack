/* eslint-disable no-unused-vars */
const { OkResponse, CreatedResponse } = require('@/core');
const { tryCatch } = require('@/middleware');
const { SpecialtyService } = require('@/services');

class SpecialtyController {
	getAll = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await SpecialtyService.getAll(),
		}).send(res);
	});

	getOne = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await SpecialtyService.getOne(req.params.id),
		}).send(res);
	});

	createOne = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			code: 402201,
			metadata: await SpecialtyService.createOne({ ...req.body }),
		}).send(res);
	});

	updateOne = tryCatch(async (req, res, next) => {
		new OkResponse({
			code: 402200,
			metadata: await SpecialtyService.updateOne({
				id: req.params.id,
				updateBody: { ...req.body },
			}),
		}).send(res);
	});

	deleteOne = tryCatch(async (req, res, next) => {
		new OkResponse({
			code: 404200,
			metadata: await SpecialtyService.deleteOne(req.params.id),
		}).send(res);
	});
}

module.exports = new SpecialtyController();
