'use strict';
const { OkResponse, CreatedResponse } = require('@/core');
const { SpecialtyService } = require('@/services');

class SpecialtyController {
	getAll = async (req, res, next) => {
		new OkResponse({
			message: 'Specialty retrieved successfully!',
			metadata: await SpecialtyService.getAll(),
		}).send(res);
	};

	getOne = async (req, res, next) => {
		new OkResponse({
			message: 'Specialty retrieved successfully!',
			metadata: await SpecialtyService.getOne(req.params.id),
		}).send(res);
	};

	createOne = async (req, res, next) => {
		new CreatedResponse({
			message: 'Specialty created successfully!',
			metadata: await SpecialtyService.createOne({ ...req.body }),
		}).send(res);
	};

	updateOne = async (req, res, next) => {
		new OkResponse({
			message: 'Specialty updated successfully!',
			metadata: await SpecialtyService.updateOne({
				id: req.params.id,
				updateBody: { ...req.body },
			}),
		}).send(res);
	};

	deleteOne = async (req, res, next) => {
		new OkResponse({
			message: 'Specialty deleted successfully!',
			metadata: await SpecialtyService.deleteOne(req.params.id),
		}).send(res);
	};
}

module.exports = new SpecialtyController();
