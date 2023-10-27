/* eslint-disable no-unused-vars */
const { CreatedResponse, OkResponse } = require('@/core');
const { tryCatch } = require('@/middleware');
const { BlogCategoryService } = require('@/services');

class BlogCategoryController {
	getAll = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await BlogCategoryService.getAll(null, 0, req.query.select),
		}).send(res);
	});

	getFlattenAll = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await BlogCategoryService.getFlattenAll(),
		}).send(res);
	});

	insertMany = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await BlogCategoryService.insertMany(req.body),
		}).send(res);
	});

	createOne = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			code: 501201,
			metadata: await BlogCategoryService.createOne(req.body),
		}).send(res);
	});

	sortable = tryCatch(async (req, res, next) => {
		new OkResponse({
			code: 503200,
			metadata: await BlogCategoryService.sortable(req.body),
		}).send(res);
	});

	updateOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			code: 503200,
			metadata: await BlogCategoryService.updateOneById({
				id: req.params.id,
				updateBody: req.body,
			}),
		}).send(res);
	});

	deleteByIds = tryCatch(async (req, res, next) => {
		new OkResponse({
			code: 504200,
			metadata: await BlogCategoryService.deleteByIds(req.body),
		}).send(res);
	});
}

module.exports = new BlogCategoryController();
