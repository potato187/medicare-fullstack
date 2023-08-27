'use strict';
const { Types } = require('mongoose');
const crypto = require('node:crypto');
const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
	return _.pick(object, fields);
};

const typeOf = (value) => {
	return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};

const generateToken = (length = 64, format = 'hex') => {
	return crypto.randomBytes(length).toString(format);
};

const convertToObjectIdMongodb = (id) => {
	return new Types.ObjectId(id);
};

const createSelectData = (select) => {
	return Object.fromEntries(select.map((key) => [key, 1]));
};

const createSortData = (sort = []) => {
	return sort.reduce((hash, sortItem) => {
		const [key, value] = sortItem;
		hash[key] = value === 'asc' ? 1 : -1;
		return hash;
	}, {});
};

const createUnSelectData = (select = ['_id', '__v', 'createdAt', 'updatedAt']) => {
	return Object.fromEntries(select.map((key) => [key, 0]));
};

const createSearchData = (fields = [], key_search, regexOptions = 'i') => {
	const searchRegex = new RegExp(key_search, regexOptions);
	return fields.map((field) => {
		return { [field]: { $regex: searchRegex } };
	});
};

const removeFalsyProperties = (falsyMap = ['undefined', 'null']) => {
	return function fn(object) {
		return Object.entries(object).reduce((obj, [key, value]) => {
			const type = typeOf(value);
			if (type !== 'object' && !falsyMap.includes(type)) {
				obj[key] = value;
			}

			if (type === 'object') {
				obj[key] = fn(value);
			}

			return obj;
		}, {});
	};
};

const flattenObject = (object = null, prefix = '') => {
	if (object === null) {
		return {};
	}

	return Object.keys(object).reduce((object, key) => {
		const value = object[key];
		const prefixKey = prefix ? `${prefix}.${key}` : key;

		if (typeOf(value) === 'string') {
			Object.assign(object, { [prefixKey]: value });
		} else {
			Object.assign(object, flattenObject(value, prefixKey));
		}

		return object;
	}, {});
};

module.exports = {
	convertToObjectIdMongodb,
	createSearchData,
	createSelectData,
	createSortData,
	createUnSelectData,
	generateToken,
	getInfoData,
	typeOf,
	flattenObject,
	removeFalsyProperties,
};
