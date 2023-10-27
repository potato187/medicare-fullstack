/* eslint-disable no-unused-vars */
const { CreatedResponse, OkResponse, InterServerRequestError } = require('@/core');
const { excelHelper } = require('@/helpers');
const { tryCatch } = require('@/middleware');
const { DoctorService } = require('@/services');

class DoctorController {
	getByQueryParams = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await DoctorService.getByQueryParams(req.query),
		}).send(res);
	});

	getOne = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await DoctorService.getOne({
				doctorId: req.params.id,
				select: req.query.select,
			}),
		}).send(res);
	});

	createOne = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			code: 400201,
			metadata: await DoctorService.createOne(req.body),
		}).send(res);
	});

	insertMany = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			code: 401201,
			metadata: await DoctorService.insertMany(req.body.doctors),
		}).send(res);
	});

	updateOne = tryCatch(async (req, res, next) => {
		new OkResponse({
			code: 400200,
			metadata: await DoctorService.updateOne({
				id: req.params.id,
				updateBody: req.body,
			}),
		}).send(res);
	});

	deleteOne = tryCatch(async (req, res, next) => {
		new OkResponse({
			code: 403200,
			metadata: await DoctorService.deleteOne({
				id: req.params.id,
			}),
		}).send(res);
	});

	export = tryCatch(async (req, res, next) => {
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
	});
}
module.exports = new DoctorController();
