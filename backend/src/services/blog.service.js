const { logEventHelper } = require('@/helpers');
const { UtilsRepo } = require('@/models/repository');
const { BLOG_MODEL } = require('@/models/repository/constant');
const { getInfoData, convertToObjectIdMongodb, createSearchData, generateImagePathByObjectId } = require('@/utils');
const fs = require('fs');

const SEARCHABLE_FIELDS = ['title.vi', 'title.en'];
const FOLDER_PATH = 'public/uploads/blogs';

class BlogService {
	static model = BLOG_MODEL;

	static getOneById(id) {
		return UtilsRepo.findOne({
			model: BlogService.model,
			filter: { _id: convertToObjectIdMongodb(id) },
			select: { __v: 0, updatedAt: 0, createdAt: 0, isDeleted: 0, isDisplay: 0 },
		});
	}

	static async getByQueryParams(queryParams) {
		const { categoryId, search, ...params } = queryParams;
		const match = { isDeleted: false };
		if (search) {
			match.$or = createSearchData(SEARCHABLE_FIELDS, search);
		}

		if (categoryId && categoryId !== 'all') {
			match.blogCategoryIds = convertToObjectIdMongodb(categoryId);
		}

		return UtilsRepo.getByQueryParams({
			model: BlogService.model,
			queryParams: { match, search, ...params },
		});
	}

	static async createOne(req) {
		const { file, body } = req;
		const newCategory = await UtilsRepo.createOne({
			model: BlogService.model,
			body,
		});

		if (file) {
			try {
				const oldPath = file.path;
				const newPath = generateImagePathByObjectId(newCategory._id, file, FOLDER_PATH);
				fs.rename(oldPath, newPath);
				newCategory.image = newPath;
				await newCategory.save();
			} catch (error) {
				logEventHelper(req, error.message);
			}
		}

		return getInfoData({
			fields: ['_id', 'title', 'datePublished', 'isDisplay'],
			object: newCategory,
		});
	}

	static async updateOneById(req) {
		const { file, params, body: updateBody } = req;
		const { id } = params;

		const fields = Object.keys(updateBody);
		if (!fields.length && !file) return {};

		const { model } = BlogService;
		const filter = { _id: convertToObjectIdMongodb(id), isDeleted: false };
		const { blogCategoryIds } = updateBody;

		const { image: oldPath } = await UtilsRepo.findDocAndThrowError({ filter, model, code: 702404, fields: ['image'] });

		if (blogCategoryIds) {
			updateBody.blogCategoryIds = blogCategoryIds.map((blogCategoryId) => convertToObjectIdMongodb(blogCategoryId));
		}

		if (file) {
			try {
				const newPath = generateImagePathByObjectId(id, file, FOLDER_PATH);
				fields.push('image');
				updateBody.image = newPath;
				if (oldPath && fs.existsSync(oldPath)) {
					fs.unlinkSync(oldPath);
				}
				fs.renameSync(file.path, newPath);
			} catch (error) {
				logEventHelper(req, error.message);
			}
		}

		return UtilsRepo.findOneAndUpdate({
			model,
			filter,
			updateBody,
			select: fields,
		});
	}

	static async deleteOneById(id) {
		return UtilsRepo.findOneAndUpdate({
			model: BlogService.model,
			filter: { _id: convertToObjectIdMongodb(id) },
			updateBody: { isDeleted: true, isDisplay: false },
			select: ['_id'],
		});
	}
}

module.exports = BlogService;
