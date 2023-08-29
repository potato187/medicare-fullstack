'use strict';
const { Types } = require('mongoose');
const crypto = require('node:crypto');
const _ = require('lodash');
const slugify = require('slugify');

const convertToObjectIdMongodb = (id) => {
	return new Types.ObjectId(id);
};

const createSearchData = (fields = [], key_search, regexOptions = 'i') => {
	const searchRegex = new RegExp(key_search, regexOptions);
	return fields.map((field) => {
		return { [field]: { $regex: searchRegex } };
	});
};

const createSelectData = (select) => {
	return Object.fromEntries(select.map((key) => [key, 1]));
};

const createSlug = (string, options = { lower: true }) => {
	return slugify(string, options);
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

const generateToken = (length = 64, format = 'hex') => {
	return crypto.randomBytes(length).toString(format);
};

const getInfoData = ({ fields = [], object = {} }) => {
	return _.pick(object, fields);
};

const isEmpty = (value) => {
	const type = typeOf(value);
	return type !== 'null' && type !== 'undefined';
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

const typeOf = (value) => {
	return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
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
	isEmpty,
	removeFalsyProperties,
	typeOf,
};
