const { OkResponse, CreatedResponse, BadRequestError } = require('@/core');
const { tryCatch } = require('@/middleware');
const { ResourceService } = require('@/services');

class ResourceClass {
	getAll = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await ResourceService.getAll({
				model: req.params.model,
				...req.query,
			}),
		}).send(res);
	});

	insertMany = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			metadata: await ResourceService.insertMany({
				model: req.params.model,
				data: req.body,
			}),
		}).send(res);
	});
}

module.exports = new ResourceClass();
