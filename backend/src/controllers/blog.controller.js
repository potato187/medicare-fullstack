/* eslint-disable no-unused-vars */
const { OkResponse, CreatedResponse } = require('@/core');
const { tryCatch } = require('@/middleware');
const { BlogService } = require('@/services');

class BlogController {
	createOne = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			metadata: await BlogService.createOne(req),
		}).send(res);
	});

	getOneById = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			metadata: await BlogService.getOneById(req.params.id),
		}).send(res);
	});

	getByQueryParams = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await BlogService.getByQueryParams(req.query),
		}).send(res);
	});

	updateOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await BlogService.updateOneById({ id: req.params.id, updateBody: req.body }),
		}).send(res);
	});

	deleteOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await BlogService.deleteOneById(req.params.id),
		}).send(res);
	});
}

module.exports = new BlogController();
