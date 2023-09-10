const { convertToObjectIdMongodb, removeFalsyProperties, flattenObject, getInfoData } = require('@/utils');
const { ForbiddenRequestError } = require('@/core');

const _AdminModel = require('../admin.model');
const _GenderModel = require('../gender.model');
const _KeyTokenModel = require('../keyToken.model');
const _PositionModel = require('../position.model');
const _RoleModel = require('../role.model');
const _SpecialtyModel = require('../specialty.model');
const _WorkingHourModel = require('../workingHour.model');
const _DoctorModel = require('../doctor.model');
const _BookingModel = require('../booking.model');
const _PostCategoryModel = require('../postCategory.model');

const {
	ADMIN_MODEL,
	KEY_TOKEN_MODEL,
	SPECIALLY_MODEL,
	GENDER_MODEL,
	ROLE_MODEL,
	POSITION_MODEL,
	WORKING_HOUR_MODEL,
	DOCTOR_MODEL,
	BOOKING_MODEL,
	POST_CATEGORY_MODEL,
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

	static async getAll({ model, query, sort, select = ['_id'] }) {
		const _Model = UtilsRepo.getModel(model);
		return _Model.find(query).sort(sort).select(select).lean().exec();
	}

	static async findOneAndUpdate({ model, filter, updateBody, options = { new: true }, select = [] }) {
		const _Model = UtilsRepo.getModel(model);

		const flattenObj = flattenObject(updateBody);
		const cleanedObj = removeFalsyProperties([null, undefined])(flattenObj);

		const updated = await _Model.findOneAndUpdate(filter, cleanedObj, options);

		return getInfoData({
			fields: select,
			object: updated,
		});
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
UtilsRepo.registerModel(SPECIALLY_MODEL, _SpecialtyModel);
UtilsRepo.registerModel(WORKING_HOUR_MODEL, _WorkingHourModel);
UtilsRepo.registerModel(DOCTOR_MODEL, _DoctorModel);
UtilsRepo.registerModel(BOOKING_MODEL, _BookingModel);
UtilsRepo.registerModel(POST_CATEGORY_MODEL, _PostCategoryModel);

module.exports = UtilsRepo;
