'use  strict';
const { CreatedResponse, OkResponse } = require('@/core');
const { DoctorService } = require('@/services');

class DoctorController {
	async queryByParameters(req, res, next) {
		new CreatedResponse({
			metadata: await DoctorService.queryByParameters(req.query),
		}).send(res);
	}

	async createOne(req, res, next) {
		new CreatedResponse({
			metadata: await DoctorService.createOne(req.body),
		}).send(res);
	}

	async insertMany(req, res, next) {
		new CreatedResponse({
			metadata: await DoctorService.insertMany(req.body),
		}).send(res);
	}

	async updateOne(req, res, next) {
		new OkResponse({
			metadata: await DoctorService.updateOne({
				doctorId: req.params.id,
				updateBody: req.body,
			}),
		}).send(res);
	}

	async deleteOne(req, res, next) {
		new OkResponse({
			metadata: await DoctorService.deleteOne({
				doctorId: req.params.id,
			}),
		}).send(res);
	}
}
module.exports = new DoctorController();
