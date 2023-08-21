'use strict';
const { SuccessResponse } = require('@/core');
const { ResourceService } = require('@/services');

class ResourceClass {
	async getAllGender(req, res, next) {
		new SuccessResponse({
			code: 100200,
			metadata: await ResourceService.getAllGender(),
		}).send(res);
	}

	async getAllAdminRole(req, res, next) {
		new SuccessResponse({
			code: 100200,
			metadata: await ResourceService.getAllAAdminRole(),
		}).send(res);
	}
}

module.exports = new ResourceClass();
