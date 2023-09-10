const { OkResponse } = require('@/core');
const { LanguageService } = require('@/services');

class LanguageController {
	getById = async (req, res) => {
		new OkResponse({
			metadata: await LanguageService.getById(req.params.id),
		}).send(res);
	};

	getAll = async (req, res) => {
		new OkResponse({
			metadata: await LanguageService.getAll(req.params.id),
		}).send(res);
	};

	updateById = async (req, res) => {
		new OkResponse({
			metadata: await LanguageService.updateById({ languageId: req.params.id, bodyUpdate: req.body }),
		}).send(res);
	};
}

module.exports = new LanguageController();
