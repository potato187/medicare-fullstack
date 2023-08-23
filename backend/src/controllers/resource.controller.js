'use strict';
const { OkResponse } = require('@/core');
const { ResourceService } = require('@/services');

class ResourceClass {
	async getAllGender(req, res, next) {
		new OkResponse({
			metadata: await ResourceService.getAllGender(),
		}).send(res);
	}

	async getAllAdminRole(req, res, next) {
		new OkResponse({
			metadata: await ResourceService.getAllAAdminRole(),
		}).send(res);
	}
}

module.exports = new ResourceClass();
