const { OkResponse } = require('@/core');
const { tryCatch } = require('@/middleware');
const { AdminService } = require('@/services');

class AdminController {
	queryByParams = tryCatch(async (req, res) => {
		new OkResponse({
			metadata: await AdminService.queryByParams(req.query),
		}).send(res);
	});

	updateOneById = tryCatch(async (req, res) => {
		new OkResponse({
			metadata: await AdminService.updateOneById({ id: req.params.id, updateBody: req.body }),
		}).send(res);
	});

	deleteOneById = tryCatch(async (req, res) => {
		new OkResponse({
			metadata: await AdminService.deleteOneById(req.params.id),
		}).send(res);
	});
}

module.exports = new AdminController();
