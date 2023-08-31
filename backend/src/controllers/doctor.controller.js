'use  strict';
const { CreatedResponse, OkResponse } = require('@/core');
const { DoctorService } = require('@/services');

class DoctorController {
	async queryByParams(req, res, next) {
		new CreatedResponse({
			metadata: await DoctorService.queryByParams(req.query),
		}).send(res);
	}
	async getOne(req, res, next) {
		new CreatedResponse({
			metadata: await DoctorService.getOne({
				doctorId: req.params.id,
				select: req.query.select,
			}),
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
				id: req.params.id,
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
