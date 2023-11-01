const fs = require('fs');
const path = require('path');
const { UtilsRepo } = require('@/models/repository');
const { HTML_CONTENT_MODEL } = require('@/models/repository/constant');
const { convertToObjectIdMongodb, createSearchData, getInfoData, generateImagePathByObjectId } = require('@/utils');
const { logEventHelper } = require('@/helpers');

const FIELDS_ABLE_SEARCH = ['title'];
const CONFIGS_PATH = '../json/modules/htmlContent.config.json';
const FOLDER_PATH = 'public/uploads/htmlContent';

class HtmlContentService {
	static model = HTML_CONTENT_MODEL;

	static async createOne(req) {
		const { file, body } = req;
		const newHtmlContent = await UtilsRepo.createOne({
			model: HtmlContentService.model,
			body,
		});

		if (file) {
			try {
				const oldPath = file.path;
				const newPath = generateImagePathByObjectId(newHtmlContent._id, file, FOLDER_PATH);
				fs.renameSync(oldPath, newPath);
				newHtmlContent.image = newPath;
				await newHtmlContent.save();
			} catch (error) {
				logEventHelper(req, error.message);
			}
		}

		return getInfoData({
			object: newHtmlContent,
			fields: ['_id', ...Object.keys(body)],
		});
	}

	static async updateOneById(req) {
		const { file, params, body } = req;
		const { id } = params;
		const fields = Object.keys(body);

		if (!fields.length && !file) return {};

		const { model } = HtmlContentService;
		const filter = { _id: convertToObjectIdMongodb(id) };

		const { image: oldPath } = await UtilsRepo.findDocAndThrowError({ filter, model, code: 702404, fields: ['image'] });

		if (file) {
			try {
				const newPath = generateImagePathByObjectId(id, file, FOLDER_PATH);
				fields.push('image');
				body.image = newPath;
				if (oldPath && fs.existsSync(oldPath)) {
					fs.unlinkSync(oldPath);
					fs.renameSync(oldPath, newPath);
				} else {
					fs.renameSync(file.path, newPath);
				}
			} catch (error) {
				logEventHelper(req, error.message);
			}
		}

		return UtilsRepo.findOneAndUpdate({
			model,
			filter,
			updateBody: body,
			select: fields,
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

		if (pageType && pageType !== 'all') {
			match.pageType = pageType;
		}

		if (positionType && positionType !== 'all') {
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
