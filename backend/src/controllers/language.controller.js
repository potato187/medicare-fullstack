const { OkResponse } = require('@/core');
const { tryCatch } = require('@/middleware');
const { LanguageService } = require('@/services');

class LanguageController {
	getById = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await LanguageService.getById(req.params.id),
		}).send(res);
	});

	getAll = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await LanguageService.getAll(req.params.id),
		}).send(res);
	});

	updateById = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await LanguageService.updateById({ languageId: req.params.id, bodyUpdate: req.body }),
		}).send(res);
	});
}

module.exports = new LanguageController();
