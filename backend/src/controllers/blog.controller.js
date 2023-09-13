const { OkResponse, CreatedResponse } = require('@/core');
const { tryCatch } = require('@/middleware');
const { BlogService } = require('@/services');

class BlogController {
	createOne = tryCatch(async (req, res) => {
		new CreatedResponse({
			metadata: await BlogService.createOne(req.body),
		}).send(res);
	});

	getOneById = tryCatch(async (req, res) => {
		new CreatedResponse({
			metadata: await BlogService.getOneById({
				id: req.params.id,
				select: req.query.select,
			}),
		}).send(res);
	});

	queryByParams = tryCatch(async (req, res) => {
		new OkResponse({
			metadata: await BlogService.queryByParams(req.query),
		}).send(res);
	});

	updateOneById = tryCatch(async (req, res) => {
		new OkResponse({
			metadata: await BlogService.updateOneById({ id: req.params.id, updateBody: req.body }),
		}).send(res);
	});

	deleteOneById = tryCatch(async (req, res) => {
		new OkResponse({
			metadata: await BlogService.deleteOneById(req.params.id),
		}).send(res);
	});
}

module.exports = new BlogController();
