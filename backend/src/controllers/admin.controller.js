'use strict';
const { SuccessResponse } = require('@/core');
const { AdminService } = require('@/services');

class AdminController {
	query = async (req, res, next) => {
		new SuccessResponse({
			code: 100200,
			metadata: await AdminService.query(req.query),
		}).send(res);
	};

	updateAdminById = async (req, res, next) => {
		new SuccessResponse({
			code: 300200,
			metadata: await AdminService.updateAdminById({ id: req.params.id, updateBody: req.body }),
		}).send(res);
	};

	deleteAdminById = async (req, res, next) => {
		new SuccessResponse({
			code: 301200,
			metadata: await AdminService.deleteAdminById(req.params.id),
		}).send(res);
	};
}

module.exports = new AdminController();
