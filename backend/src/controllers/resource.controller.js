'use strict';
const { OkResponse } = require('@/core');
const { ResourceService } = require('@/services');

class ResourceClass {
	async getAllGender(req, res, next) {
		new OkResponse({
			metadata: await ResourceService.getAllGender(),
		}).send(req, res);
	}

	async getAllAdminRole(req, res, next) {
		new OkResponse({
			metadata: await ResourceService.getAllAAdminRole(),
		}).send(req, res);
	}
}

module.exports = new ResourceClass();
