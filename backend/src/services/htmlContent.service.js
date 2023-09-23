const fs = require('fs');
const path = require('path');
const { UtilsRepo } = require('@/models/repository');
const { HTML_CONTENT_MODEL } = require('@/models/repository/constant');
const { convertToObjectIdMongodb, createSearchData, getInfoData } = require('@/utils');

const FIELDS_ABLE_SEARCH = ['title'];
const CONFIGS_PATH = '../json/modules/htmlContent.config.json';

class HtmlContentService {
	static model = HTML_CONTENT_MODEL;

	static async createOne(body) {
		const newHtmlContent = await UtilsRepo.createOne({
			model: HtmlContentService.model,
			body,
		});

		return getInfoData({
			object: newHtmlContent,
			fields: ['_id', ...Object.keys(body)],
		});
	}

	static async updateOneById({ id, updateBody }) {
		const select = Object.keys(updateBody);

		if (!select.length) return {};
		const { model } = HtmlContentService;
		const filter = { _id: convertToObjectIdMongodb(id) };

		await UtilsRepo.checkIsExist({ filter, model });

		return UtilsRepo.findOneAndUpdate({
			model,
			filter,
			updateBody,
			select: Object.keys(updateBody),
		});
	}

	static async deleteOneById(id) {
		const result = await HtmlContentService.updateOneById({
			id,
			updateBody: { isDeleted: true },
		});

		if (result.isDeleted) {
			return { _id: id };
		}

		return result;
	}

	static async getByQueryParams(queryParams) {
		const { search, page_type: pageType, page_position: positionType, ...params } = queryParams;
		const match = { isDeleted: false };

		if (pageType !== 'all') {
			match.pageType = pageType;
		}

		if (positionType !== 'all') {
			match.positionType = positionType;
		}

		if (search) {
			match.$or = createSearchData(FIELDS_ABLE_SEARCH, search);
		}

		return UtilsRepo.getByQueryParams({
			model: HtmlContentService.model,
			queryParams: { search, match, ...params },
		});
	}

	static async getById(id) {
		return UtilsRepo.findOne({
			model: HtmlContentService.model,
			filter: { _id: convertToObjectIdMongodb(id) },
			select: ['title', 'content', 'pageType', 'positionType', 'icon', 'url', 'index', 'image'],
		});
	}

	static getConfigs() {
		const filePath = path.join(__dirname, CONFIGS_PATH);
		const file = fs.readFileSync(filePath, 'utf8');
		return JSON.parse(file);
	}
}

module.exports = HtmlContentService;
