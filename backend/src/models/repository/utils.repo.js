const {
	convertToObjectIdMongodb,
	removeFalsyProperties,
	flattenObject,
	getInfoData,
	createSelectData,
	createSortData,
} = require('@/utils');
const { ForbiddenRequestError, NotFoundRequestError, ConflictRequestError } = require('@/core');

const _AdminModel = require('../admin.model');
const _GenderModel = require('../gender.model');
const _KeyTokenModel = require('../keyToken.model');
const _PositionModel = require('../position.model');
const _RoleModel = require('../role.model');
const _SpecialtyModel = require('../specialty.model');
const _WorkingHourModel = require('../workingHour.model');
const _DoctorModel = require('../doctor.model');
const _BookingModel = require('../booking.model');
const _BlogCategoryModel = require('../blogCategory.model');
const _BlogModel = require('../blog.model');
const _HtmlContentModel = require('../htmlContent.model');

const {
	ADMIN_MODEL,
	KEY_TOKEN_MODEL,
	SPECIALTY_MODEL,
	GENDER_MODEL,
	ROLE_MODEL,
	POSITION_MODEL,
	WORKING_HOUR_MODEL,
	DOCTOR_MODEL,
	BOOKING_MODEL,
	BLOG_CATEGORY_MODEL,
	BLOG_MODEL,
	HTML_CONTENT_MODEL,
} = require('./constant');

class UtilsRepo {
	static modelsRegister = {};

	static registerModel = (model, modelRef) => {
		UtilsRepo.modelsRegister[model] = modelRef;
	};

	static getModel(model) {
		const Model = UtilsRepo.modelsRegister[model];
		if (!Model) {
			throw new ForbiddenRequestError(` ${model} is a invalid model in UtilsRepo`);
		}
		return Model;
	}

	static async checkIsExist({ filter, model, code = 100404 }) {
		const result = await UtilsRepo.findOne({
			model,
			filter,
		});

		if (!result) {
			throw new NotFoundRequestError({ code });
		}

		return true;
	}

	static async checkConflicted(filter, model = BOOKING_MODEL, code = 100400) {
		const result = await UtilsRepo.findOne({
			model,
			filter,
			select: ['_id'],
		});
		if (!result) {
			throw new ConflictRequestError({ code });
		}

		return true;
	}

	static async createOne({ model, body }) {
		const _Model = UtilsRepo.getModel(model);
		return _Model.create(body);
	}

	static async insertMany({ model, dataArray = [] }) {
		const _Model = UtilsRepo.getModel(model);
		return _Model.create(dataArray);
	}

	static async findOne({ model, filter, select = ['_id'] }) {
		const _Model = UtilsRepo.getModel(model);
		return _Model.findOne(filter).select(select).lean();
	}

	static async findOneAndUpdate({ model, filter, updateBody, options = { new: true }, select = [] }) {
		const _Model = UtilsRepo.getModel(model);

		const flattenObj = flattenObject(updateBody);
		const cleanedObj = removeFalsyProperties([undefined])(flattenObj);

		const updated = await _Model.findOneAndUpdate(filter, cleanedObj, options);

		return getInfoData({
			fields: select,
			object: updated,
		});
	}

	static async getAll({ model, query, sort, select = ['_id'] }) {
		const _Model = UtilsRepo.getModel(model);
		return _Model.find(query).sort(sort).select(select).lean().exec();
	}

	static async getByQueryParams({ model, queryParams }) {
		const _Model = UtilsRepo.getModel(model);
		const { search, match, sort = [], page = 1, pagesize = 25, select = [] } = queryParams;
		const $skip = (+page - 1) * pagesize;
		const $limit = +pagesize;
		const $sort = sort.length ? createSortData(sort) : { index: 1 };
		const $select = createSelectData(select);

		const [{ results, total }] = await _Model
			.aggregate()
			.match(match)
			.facet({
				results: [
					{ $sort },
					{ $skip },
					{ $limit },
					{
						$project: {
							_id: 1,
							...$select,
						},
					},
				],
				totalCount: [{ $count: 'count' }],
			})
			.addFields({
				total: {
					$ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0],
				},
			})
			.project({
				results: 1,
				total: 1,
			});

		return {
			data: results,
			meta: {
				page: +page,
				pagesize: $limit,
				totalPages: Math.ceil(total / $limit) || 1,
				search,
			},
		};
	}

	static async removeById({ model, id }) {
		const _Model = UtilsRepo.getModel(model);
		return _Model.deleteOne({ _id: convertToObjectIdMongodb(id) });
	}

	static async countByFilter({ model, filter = {} }) {
		const _Model = UtilsRepo.getModel(model);
		return _Model.countDocuments(filter);
	}
}

UtilsRepo.registerModel(ADMIN_MODEL, _AdminModel);
UtilsRepo.registerModel(ROLE_MODEL, _RoleModel);
UtilsRepo.registerModel(GENDER_MODEL, _GenderModel);
UtilsRepo.registerModel(KEY_TOKEN_MODEL, _KeyTokenModel);
UtilsRepo.registerModel(POSITION_MODEL, _PositionModel);
UtilsRepo.registerModel(SPECIALTY_MODEL, _SpecialtyModel);
UtilsRepo.registerModel(WORKING_HOUR_MODEL, _WorkingHourModel);
UtilsRepo.registerModel(DOCTOR_MODEL, _DoctorModel);
UtilsRepo.registerModel(BOOKING_MODEL, _BookingModel);
UtilsRepo.registerModel(BLOG_CATEGORY_MODEL, _BlogCategoryModel);
UtilsRepo.registerModel(BLOG_MODEL, _BlogModel);
UtilsRepo.registerModel(HTML_CONTENT_MODEL, _HtmlContentModel);

module.exports = UtilsRepo;
