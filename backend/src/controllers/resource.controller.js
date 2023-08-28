'use strict';
const { OkResponse } = require('@/core');
const { GENDER_MODEL, ROLE_MODEL, SPECIALLY_MODEL } = require('@/models/repository/constant');
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
}

module.exports = new ResourceClass();
