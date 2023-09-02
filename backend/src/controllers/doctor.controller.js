'use  strict';
const { CreatedResponse, OkResponse, InterServerRequestError } = require('@/core');
const { excelHelper } = require('@/helpers');
const { DoctorService } = require('@/services');

class DoctorController {
	async queryByParams(req, res, next) {
		new OkResponse({
			metadata: await DoctorService.queryByParams(req.query),
		}).send(res);
	}
	async getOne(req, res, next) {
		new OkResponse({
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
				id: req.params.id,
			}),
		}).send(res);
	}

	async export(req, res, next) {
		const data = await DoctorService.export(req.body);
		const workbook = excelHelper.exportWorkbook(data, req.body.languageId);

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');

		workbook.xlsx
			.write(res)
			.then(() => {
				res.status(200).end();
			})
			.catch(() => {
				next(new InterServerRequestError());
			});
	}
}
module.exports = new DoctorController();
