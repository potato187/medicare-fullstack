/* eslint-disable no-unused-vars */
const { CreatedResponse, OkResponse } = require('@/core');
const { tryCatch } = require('@/middleware');
const { NewsService } = require('@/services');

class NewsController {
	createOne = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			metadata: await NewsService.createOne(req.body),
		}).send(res);
	});

	getConfig = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			metadata: await NewsService.getConfig(),
		}).send(res);
	});

	getOneById = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			metadata: await NewsService.getOneById({
				id: req.params.id,
				select: req.query.select,
			}),
		}).send(res);
	});

	getByQueryParams = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await NewsService.getByQueryParams(req.query),
		}).send(res);
	});

	deleteOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await NewsService.deleteOneById(req.params.id),
		}).send(res);
	});

	updateOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await NewsService.updateOneById({
				id: req.params.id,
				updateBody: req.body,
			}),
		}).send(res);
	});
}

module.exports = new NewsController();
