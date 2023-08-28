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
<<<<<<< HEAD
		}).send(res);
	}

	async insertMany(req, res, next) {
		new OkResponse({
			metadata: await ResourceService.insertMany({
				model: req.params.model,
				data: req.body,
			}),
=======
>>>>>>> 0b42fde (Refactoring backend  resource feature)
		}).send(res);
	}
}

module.exports = new ResourceClass();
