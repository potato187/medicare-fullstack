'use strict';
const _AdminModel = require('../admin.model');
const _SpecialtyModel = require('../specialty.model');
const _KeyTokenModel = require('../keyToken.model');
const _GenderModel = require('../gender.model');
const _RoleModel = require('../role.model');
const { createSelectData, convertToObjectIdMongodb, removeFalsyProperties, flattenObject } = require('@/utils');
const { ForbiddenRequestError } = require('@/core');
const { ADMIN_MODEL, KEY_TOKEN_MODEL, SPECIALLY_MODEL, GENDER_MODEL, ROLE_MODEL } = require('./constant');

class UtilsRepo {
	static modelsRegister = {};
	static registerModel = (model, modelRef) => {
		UtilsRepo.modelsRegister[model] = modelRef;
	};

	static getModel(model) {
		const Model = UtilsRepo.modelsRegister[model];
		if (!Model) {
			throw new ForbiddenRequestError(` ${model} is invalid model in Utils Role Class`);
		}
		return Model;
	}

	static async createOne({ model, body }) {
		const _Model = UtilsRepo.getModel(model);
		return await _Model.create(body);
	}

	static async findOne({ model, filter, select = ['_id'] }) {
		const _Model = UtilsRepo.getModel(model);
		return await _Model.findOne(filter).select(createSelectData(select)).lean();
	}

	static async find({ model, filter }) {
		const _Model = UtilsRepo.getModel(model);
		return await _Model.find(filter);
	}

	static async findByIdAndUpdate({ model, id, updateBody, options = { new: true } }) {
		const _Model = UtilsRepo.getModel(model);
		const flattenObj = flattenObject(updateBody);
		const cleanedObj = removeFalsyProperties(flattenObj);
		return await _Model.findByIdAndUpdate(id, cleanedObj, options);
	}

	static async removeById({ model, id }) {
		const _Model = UtilsRepo.getModel(model);
		return _Model.deleteOne({ _id: convertToObjectIdMongodb(id) });
	}

	static async getAll({ model, query, sort, select = ['_id'] }) {
		const _Model = UtilsRepo.getModel(model);
		return _Model.find(query).sort(sort).select(select).lean().exec();
	}
}

UtilsRepo.registerModel(ADMIN_MODEL, _AdminModel);
UtilsRepo.registerModel(GENDER_MODEL, _GenderModel);
UtilsRepo.registerModel(SPECIALLY_MODEL, _SpecialtyModel);
UtilsRepo.registerModel(ROLE_MODEL, _RoleModel);
UtilsRepo.registerModel(KEY_TOKEN_MODEL, _KeyTokenModel);

module.exports = UtilsRepo;
