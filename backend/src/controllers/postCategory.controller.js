'use strict';
const { CreatedResponse, OkResponse } = require('@/core');
const { PostCategoryService } = require('@/services');

class PostCategoryController {
	create = async (req, res, next) => {
		new CreatedResponse({
			metadata: await PostCategoryService.create(req.body),
		}).send(res);
	};

	updateById = async (req, res, next) => {
		new OkResponse({
			metadata: await PostCategoryService.updateById({
				id: req.params.id,
				updateBody: req.body,
			}),
		}).send(res);
	};

	deleteById = async (req, res, next) => {
		new OkResponse({
			metadata: await PostCategoryService.deleteById(req.params.id),
		}).send(res);
	};
}

module.exports = new PostCategoryController();
