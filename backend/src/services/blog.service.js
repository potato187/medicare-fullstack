const { logEventHelper } = require('@/helpers');
const { UtilsRepo } = require('@/models/repository');
const { BLOG_MODEL } = require('@/models/repository/constant');
const { getInfoData, convertToObjectIdMongodb, createSearchData } = require('@/utils');
const fs = require('fs');
const path = require('path');

const SEARCHABLE_FIELDS = ['title.vi', 'title.en'];

class BlogService {
	static model = BLOG_MODEL;

	static generateImagePath(blogId, file) {
		return path.join('public/uploads/blogs', `${blogId}${path.extname(file.originalname)}`);
	}

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
				const newPath = BlogService.generateImagePath(newCategory._id, file);
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

	static async updateOneById({ id, updateBody, file }) {
		const select = Object.keys(updateBody);
		const { blogCategoryIds, ...body } = updateBody;
		const { model } = BlogService;

		if (!select.length) return {};
		const filter = { _id: convertToObjectIdMongodb(id), isDeleted: false };

		const [blog] = await UtilsRepo.findDocOrThrow({
			model,
			filter,
		});

		if (blogCategoryIds) {
			blog.blogCategoryIds = blogCategoryIds.map((blogCategoryId) => convertToObjectIdMongodb(blogCategoryId));
		}

		Object.assign(blog, body);

		if (file) {
			const imagePath = BlogService.generateImagePath(blog._id, file);
			if (blog.image && fs.existsSync(blog.image)) {
				fs.unlinkSync(blog.image);
				fs.renameSync(file.path, imagePath);
				blog.image = imagePath;
			} else {
				fs.renameSync(file.path, imagePath);
				blog.image = imagePath;
			}
			select.push('image');
		}

		return getInfoData({
			fields: select,
			object: await blog.save(),
		});
	}

	static async deleteOneById(id) {
		return BlogService.updateOneById({ id, updateBody: { isDeleted: true, isDisplay: false } });
	}
}

module.exports = BlogService;
