/* eslint-disable no-unused-vars */
const { CreatedResponse, OkResponse } = require('@/core');
const { tryCatch } = require('@/middleware');
const { LinkService } = require('@/services');

class LinkController {
	createOne = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			code: 701201,
			metadata: await LinkService.createOne(req.body),
		}).send(res);
	});

	getAll = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await LinkService.getAll(null, 0, req.query),
		}).send(res);
	});

	getOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await LinkService.getOneById(req.params.id),
		}).send(res);
	});

	updateOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			code: 701200,
			metadata: await LinkService.updateOneById({
				id: req.params.id,
				updateBody: req.body,
			}),
		}).send(res);
	});

	sortable = tryCatch(async (req, res, next) => {
		new OkResponse({
			code: 706200,
			metadata: await LinkService.sortable(req.body),
		}).send(res);
	});

	deleteByIds = tryCatch(async (req, res, next) => {
		new OkResponse({
			code: 705200,
			metadata: await LinkService.deleteByIds(req.body),
		}).send(res);
	});
}

module.exports = new LinkController();
