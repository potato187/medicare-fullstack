/* eslint-disable no-unused-vars */
const { OkResponse } = require('@/core');
const { tryCatch } = require('@/middleware');
const { AdminService } = require('@/services');

class AdminController {
	getByQueryParams = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await AdminService.getByQueryParams(req.query),
		}).send(res);
	});

	getOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await AdminService.getOneById({
				id: req.params.id,
				select: req.query.select,
			}),
		}).send(res);
	});

	updateOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			code: 300200,
			metadata: await AdminService.updateOneById({ id: req.params.id, updateBody: req.body }),
		}).send(res);
	});

	deleteOneById = tryCatch(async (req, res, next) => {
		new OkResponse({
			code: 301204,
			metadata: await AdminService.deleteOneById(req.params.id),
		}).send(res);
	});
}

module.exports = new AdminController();
