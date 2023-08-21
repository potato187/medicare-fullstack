'use strict';
const { OkResponse } = require('@/core');
const { LanguageService } = require('@/services');

class LanguageController {
	getById = async (req, res, next) => {
		new OkResponse({
			metadata: await LanguageService.getById(req.params.id),
		}).send(req, res);
	};

	getAll = async (req, res, next) => {
		new OkResponse({
			metadata: await LanguageService.getAll(req.params.id),
		}).send(req, res);
	};

	updateById = async (req, res, next) => {
		new OkResponse({
			metadata: await LanguageService.updateById({ languageId: req.params.id, bodyUpdate: req.body }),
		}).send(req, res);
	};
}

module.exports = new LanguageController();
