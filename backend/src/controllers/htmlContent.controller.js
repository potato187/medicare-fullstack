/* eslint-disable no-unused-vars */
const { OkResponse, CreatedResponse, BadRequestError } = require('@/core');
const { tryCatch } = require('@/middleware');
const { HtmlContentService } = require('@/services');

class HtmlContentController {
	createOne = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			code: 700201,
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
			metadata: await HtmlContentService.getById(req.params.id),
		}).send(res);
	});

	getConfigs = (req, res, next) => {
		new OkResponse({
			metadata: HtmlContentService.getConfigs(),
		}).send(res);
	};

	UpdateOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			code: 700200,
			metadata: await HtmlContentService.updateOneById({
				id: req.params.id,
				updateBody: req.body,
			}),
		}).send(res);
	});

	deleteOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			code: 704200,
			metadata: await HtmlContentService.deleteOneById(req.params.id),
		}).send(res);
	});
}
module.exports = new HtmlContentController();
