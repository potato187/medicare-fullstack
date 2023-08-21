'use strict';
const { OkResponse } = require('@/core');
const { AdminService } = require('@/services');

class AdminController {
	query = async (req, res, next) => {
		new OkResponse({
			metadata: await AdminService.query(req.query),
		}).send(req, res);
	};

	updateAdminById = async (req, res, next) => {
		new OkResponse({
			code: 300200,
			metadata: await AdminService.updateAdminById({ id: req.params.id, updateBody: req.body }),
		}).send(req, res);
	};

	deleteAdminById = async (req, res, next) => {
		new OkResponse({
			code: 301204,
			metadata: await AdminService.deleteAdminById(req.params.id),
		}).send(req, res);
	};
}

module.exports = new AdminController();
