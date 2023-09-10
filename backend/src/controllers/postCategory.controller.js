const { CreatedResponse, OkResponse } = require('@/core');
const { PostCategoryService } = require('@/services');

class PostCategoryController {
	createOne = async (req, res) => {
		new CreatedResponse({
			metadata: await PostCategoryService.createOne(req.body),
		}).send(res);
	};

	updateOneById = async (req, res) => {
		new OkResponse({
			metadata: await PostCategoryService.updateOneById({
				id: req.params.id,
				updateBody: req.body,
			}),
		}).send(res);
	};

	deleteOneById = async (req, res) => {
		new OkResponse({
			metadata: await PostCategoryService.deleteOneById(req.params.id),
		}).send(res);
	};
}

module.exports = new PostCategoryController();
