const path = require('path');
const fs = require('fs');
const { UtilsRepo } = require('@/models/repository');
const { NEWS_MODEL } = require('@/models/repository/constant');
const { getInfoData, convertToObjectIdMongodb } = require('@/utils');
const { SELECT_FIELDS } = require('@/constant/news.constant');

class NewsService {
	static model = NEWS_MODEL;

	static CONFIG_PATH = path.join(__dirname, '../json/modules/news.config.json');

	static async createOne(body) {
		const news = await UtilsRepo.createOne({
			model: NewsService.model,
			body,
		});

		return getInfoData({
			fields: ['_id', 'name', 'positionType', 'index', 'quantity', 'isDisplay'],
			object: news,
		});
	}

	static async getOneById({ id, select }) {
		return UtilsRepo.findOne({
			model: NewsService.model,
			filter: { _id: convertToObjectIdMongodb(id) },
			select,
		});
	}

	static async getByQueryParams(queryParams) {
		const { page_type: pageType, page_position: positionType, search = '', ...params } = queryParams;
		const match = { isDeleted: false };

		if (pageType && pageType !== 'all') {
			match.pageType = pageType;
		}

		if (positionType && positionType !== 'all') {
			match.positionType = positionType;
		}

		return UtilsRepo.getByQueryParams({
			model: NewsService.model,
			queryParams: { search, match, ...params },
		});
	}

	static async updateOneById({ id, updateBody }) {
		const select = Object.keys(updateBody);
		if (!select.length) return {};

		const filter = { _id: convertToObjectIdMongodb(id) };
		const { model } = NewsService;

		await UtilsRepo.checkIsExist({ filter, model });

		return UtilsRepo.findOneAndUpdate({
			model,
			filter,
			updateBody,
			select,
		});
	}

	static async deleteOneById(id) {
		return NewsService.updateOneById({ id, updateBody: { isDeleted: true } });
	}

	static async getConfig() {
		const fileContent = fs.readFileSync(NewsService.CONFIG_PATH, 'utf-8');
		return JSON.parse(fileContent);
	}
}

module.exports = NewsService;
