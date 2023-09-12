const { CreatedResponse, OkResponse } = require('@/core');
const { tryCatch } = require('@/middleware');
const { PostCategoryService } = require('@/services');

class PostCategoryController {
	getAll = tryCatch(async (req, res) => {
		new OkResponse({
			metadata: await PostCategoryService.getAll(null, 0, req.params.select),
		}).send(res);
	});

	createOne = tryCatch(async (req, res) => {
		new CreatedResponse({
			metadata: await PostCategoryService.createOne(req.body),
		}).send(res);
	});

	sortable = tryCatch(async (req, res) => {
		new CreatedResponse({
			metadata: await PostCategoryService.sortable(req.body),
		}).send(res);
	});

	updateOneById = tryCatch(async (req, res) => {
		new OkResponse({
			metadata: await PostCategoryService.updateOneById({
				id: req.params.id,
				updateBody: req.body,
			}),
		}).send(res);
	});

	deleteByIds = tryCatch(async (req, res) => {
		new OkResponse({
			metadata: await PostCategoryService.deleteByIds(req.body),
		}).send(res);
	});
}

module.exports = new PostCategoryController();
