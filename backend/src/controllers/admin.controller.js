'use strict';
const { SuccessResponse } = require('@/core');
const { AdminService } = require('@/services');

class AdminController {
	query = async (req, res, next) => {
		new SuccessResponse({
			message: 'Query successfully!',
			metadata: await AdminService.query(req.query),
		}).send(res);
	};

	updateAdminById = async (req, res, next) => {
		new SuccessResponse({
			message: 'Update admin  successfully!',
			metadata: await AdminService.updateAdminById({ id: req.params.id, updateBody: req.body }),
		}).send(res);
	};

	deleteAdminById = async (req, res, next) => {
		new SuccessResponse({
			message: 'Delete admin  successfully!',
			metadata: await AdminService.deleteAdminById(req.params.id),
		}).send(res);
	};
}

module.exports = new AdminController();
