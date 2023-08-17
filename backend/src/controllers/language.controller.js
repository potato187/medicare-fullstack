'use strict';
const { SuccessResponse } = require('@/core');
const { LanguageService } = require('@/services');

class LanguageController {
	getById = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get languages successfully!',
			metadata: await LanguageService.getById(req.params.id),
		}).send(res);
	};

	getAll = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get languages successfully!',
			metadata: await LanguageService.getAll(req.params.id),
		}).send(res);
	};

	updateById = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get languages successfully!',
			metadata: await LanguageService.updateById({ languageId: req.params.id, bodyUpdate: req.body }),
		}).send(res);
	};
}

module.exports = new LanguageController();
