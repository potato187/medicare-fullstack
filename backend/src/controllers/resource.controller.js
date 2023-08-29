'use strict';
const { OkResponse, CreatedResponse } = require('@/core');
const { ResourceService } = require('@/services');

class ResourceClass {
	async getAll(req, res, next) {
		new OkResponse({
			metadata: await ResourceService.getAll({
				model: req.params.model,
				...req.query,
			}),
		}).send(res);
	}

	async insertMany(req, res, next) {
		new CreatedResponse({
			metadata: await ResourceService.insertMany({
				model: req.params.model,
				data: req.body,
			}),
		}).send(res);
	}
}

module.exports = new ResourceClass();
