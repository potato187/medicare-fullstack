/* eslint-disable no-unused-vars */
const { OkResponse, CreatedResponse, BadRequestError } = require('@/core');
const { tryCatch } = require('@/middleware');
const { HtmlContentService } = require('@/services');

class HtmlContentController {
	createOne = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			metadata: await HtmlContentService.createOne(req.body),
		}).send(res);
	});

	getByQueryParams = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await HtmlContentService.getByQueryParams(req.query),
		}).send(res);
	});

	getById = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await HtmlContentService.getById({
				id: req.params.id,
				select: req.query.select,
			}),
		}).send(res);
	});

	getConfigs = tryCatch((req, res, next) => {
		new OkResponse({
			metadata: HtmlContentService.getConfigs(),
		}).send(res);
	});

	UpdateOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await HtmlContentService.updateOneById({
				id: req.params.id,
				updateBody: req.body,
			}),
		}).send(res);
	});

	deleteOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await HtmlContentService.deleteOneById(req.params.id),
		}).send(res);
	});
}
module.exports = new HtmlContentController();
