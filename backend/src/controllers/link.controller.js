/* eslint-disable no-unused-vars */
const { CreatedResponse } = require('@/core');
const { tryCatch } = require('@/middleware');
const { LinkService } = require('@/services');

class LinkController {
	createOne = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			metadata: await LinkService.createOne(req.body),
		}).send(res);
	});

	updateOneById = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			metadata: await LinkService.updateOneById({
				id: req.params.id,
				updateBody: req.bod,
			}),
		}).send(res);
	});

	deleteOneById = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			metadata: await LinkService.deleteOneById(req.params.id),
		}).send(res);
	});
}

module.exports = new LinkController();
