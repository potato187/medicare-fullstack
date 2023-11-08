const { _LinKModel } = require('@/models');
const { UtilsRepo } = require('@/models/repository');
const { LINK_MODEL } = require('@/models/repository/constant');
const { getInfoData, convertToObjectIdMongodb } = require('@/utils');

class LinkService {
	static model = LINK_MODEL;

	static async createOne(body) {
		const newLink = await UtilsRepo.createOne({
			model: LinkService.model,
			body,
		});

		const { _id, ...linkInfo } = getInfoData({
			fields: ['_id', 'name', 'index', 'url', 'parentId', 'isDisplay'],
			object: newLink,
		});

		return {
			id: _id,
			children: [],
			depth: 0,
			collapsed: false,
			...linkInfo,
		};
	}

	static async getAll(parentId = null, depth = 0, params = {}) {
		const { type, select } = params;
		const filter = {
			parentId,
			isDeleted: false,
			type,
		};

		const results = await _LinKModel.find(filter).sort({ index: 1 }).select(select).lean();

		const links = await Promise.all(
			results.map(async (link) => {
				const { _id, ...rest } = link;
				rest.id = _id;
				rest.depth = depth;
				rest.collapsed = false;
				rest.children = await LinkService.getAll(rest.id, depth + 1, params);
				return rest;
			}),
		);

		return links;
	}

	static async getOneById(id) {
		return UtilsRepo.findOne({
			model: LinkService.model,
			filter: { _id: convertToObjectIdMongodb(id) },
			select: ['name', 'url', 'index', 'parentId', 'isDisplay'],
		});
	}

	static async updateOneById({ id, updateBody }) {
		const { model } = LinkService;
		const { type, select, ...body } = updateBody;

		if (!Object.keys(body).length) return [];
		const filter = { _id: convertToObjectIdMongodb(id) };
		await UtilsRepo.checkIsExist({
			model,
			filter,
		});

		await UtilsRepo.findOneAndUpdate({
			model,
			filter,
			updateBody: body,
		});

		return LinkService.getAll(null, 0, { type, select });
	}

	static async deleteOneById(id) {
		return LinkService.updateOneById({
			id,
			updateBody: { isDeleted: true },
		});
	}

	static async deleteByIds(body) {
		const { listId, ...params } = body;
		const promises = listId.map((id) => {
			return LinkService.updateOneById({ id, updateBody: { isDeleted: true, isDisplay: false } });
		});

		await Promise.all(promises);

		return LinkService.getAll(null, 0, params);
	}

	static async sortable(body) {
		const updateOperations = body.map(({ id, ...updateBody }) => {
			return {
				filter: { _id: convertToObjectIdMongodb(id) },
				updateBody,
			};
		});

		const promises = updateOperations.map(async ({ filter, updateBody }) => {
			return UtilsRepo.findOneAndUpdate({
				model: LinkService.model,
				filter,
				updateBody,
				select: ['_id', 'parentId', 'index'],
			});
		});

		return Promise.all(promises);
	}
}

module.exports = LinkService;
