const { UtilsRepo } = require('@/models/repository');
const { HTML_CONTENT_MODEL } = require('@/models/repository/constant');
const { convertToObjectIdMongodb, createSearchData } = require('@/utils');

const FIELDS_ABLE_SEARCH = ['title'];

class HtmlContentService {
	static model = HTML_CONTENT_MODEL;

	static async createOne(body) {
		return UtilsRepo.createOne({
			model: this.model,
			body,
		});
	}

	static async updateOneById({ id, updateBody }) {
		await UtilsRepo.checkIsExist({ _id: convertToObjectIdMongodb(id), model: this.model });
		return UtilsRepo.updateOneById({ id, updateBody });
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
