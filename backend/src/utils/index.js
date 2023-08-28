'use strict';
const { Types } = require('mongoose');
const crypto = require('node:crypto');
const _ = require('lodash');
const slugify = require('slugify');

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
	if (object === null || object === undefined) {
		return {};
	}

	return Object.entries(object).reduce((obj, [key, value]) => {
		const prefixKey = prefix ? `${prefix}.${key}` : key;

		if (typeOf(value) !== 'object') {
			obj[prefixKey] = value;
		}

		if (typeOf(value) === 'object') {
			Object.assign(obj, flattenObject(value, prefixKey));
		}

		return obj;
	}, {});
};

const createSlug = (string, options = { lower: true }) => {
	return slugify(string, options);
};

module.exports = {
	convertToObjectIdMongodb,
	createSearchData,
	createSelectData,
	createSlug,
	createSortData,
	createUnSelectData,
	flattenObject,
	generateToken,
	getInfoData,
	removeFalsyProperties,
	typeOf,
};
