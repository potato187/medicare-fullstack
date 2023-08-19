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
}

module.exports = new AdminController();
