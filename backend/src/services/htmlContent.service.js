const { MONGODB_EXCLUDE_FIELDS } = require('@/constant');
const { UtilsRepo } = require('@/models/repository');
const { HTML_CONTENT_MODEL } = require('@/models/repository/constant');
const { convertToObjectIdMongodb, createSearchData, getInfoData } = require('@/utils');

const FIELDS_ABLE_SEARCH = ['title'];

class HtmlContentService {
	static model = HTML_CONTENT_MODEL;

	static async createOne(body) {
		const newHtmlContent = await UtilsRepo.createOne({
			model: this.model,
			body,
		});

		return getInfoData({
			object: newHtmlContent,
			fields: ['_id', ...Object.keys(body)],
		});
	}

	static async updateOneById({ id, updateBody }) {
		if (!Object.keys(updateBody).length) return {};

		const filter = { _id: convertToObjectIdMongodb(id) };

		await UtilsRepo.checkIsExist({ filter, model: this.model });

		return UtilsRepo.findOneAndUpdate({
			model: this.model,
			filter,
			updateBody,
			select: Object.keys(updateBody),
		});
	}

	static async deleteOneById(id) {
		return HtmlContentService.updateOneById(id, { isDeleted: true });
	}

	static async getByQueryParams(queryParams) {
		const { search, pageType, positionType, ...params } = queryParams;
		const match = { isDeleted: false };

		if (pageType !== 'all') {
			match.pageType = pageType;
		}

		if (positionType !== 'all') {
			match.positionType = positionType;
		}

		if (!search) {
			match.$or = createSearchData(FIELDS_ABLE_SEARCH, search);
		}

		return UtilsRepo.getByQueryParams({
			model: this.model,
			queryParams: { search, match, ...params },
		});
	}

	static async getById({ id, select }) {
		return UtilsRepo.findOne({
			model: this.model,
			filter: { _id: convertToObjectIdMongodb(id) },
			select,
		});
	}
}

module.exports = HtmlContentService;
