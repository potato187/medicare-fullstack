const { Types } = require('mongoose');
const crypto = require('node:crypto');
const _ = require('lodash');
const slugify = require('slugify');
const fs = require('fs');

const typeOf = (value) => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);

const createSearchData = (fields, keySearch, regexOptions = 'i') => {
	const searchRegex = new RegExp(keySearch, regexOptions);
	return fields.map((field) => ({ [field]: { $regex: searchRegex } }));
};

const createSelectData = (select) => Object.fromEntries(select.map((key) => [key, 1]));

const createSlug = (string, options = { lower: true }) => slugify(string, options);

const createSortData = (sort = []) =>
	sort.reduce((hash, sortItem) => {
		const [key, value] = sortItem;
		return { ...hash, [key]: value === 'asc' ? 1 : -1 };
	}, {});

const createUnSelectData = (select = ['_id', '__v', 'createdAt', 'updatedAt']) =>
	Object.fromEntries(select.map((key) => [key, 0]));

const flattenObject = (object = null, prefix = '') => {
	if (object === null || object === undefined) {
		return {};
	}

	return Object.entries(object).reduce((obj, [key, value]) => {
		const prefixKey = prefix ? `${prefix}.${key}` : key;

		if (typeOf(value) !== 'object') {
			// eslint-disable-next-line no-param-reassign
			obj[prefixKey] = value;
		}

		if (typeOf(value) === 'object') {
			Object.assign(obj, flattenObject(value, prefixKey));
		}

		return obj;
	}, {});
};

const generateToken = (length = 64, format = 'hex') => crypto.randomBytes(length).toString(format);

const getInfoData = ({ fields = [], object = {} }) => _.pick(object, fields);

const pickFields = ({ object = {}, excludeFields = [] }) => {
	const includedFields = Object.keys(object).filter((k) => !excludeFields.includes(k));
	return _.pick(object, includedFields);
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
				// eslint-disable-next-line no-param-reassign
				obj[key] = value;
			}

			if (type === 'object') {
				// eslint-disable-next-line no-param-reassign
				obj[key] = fn(value);
			}

			return obj;
		}, {});
	};
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
	pickFields,
};
