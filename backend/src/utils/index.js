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
		hash[key] = value;
		return hash;
	}, {});
};

const getUnSelectData = (select = []) => {
	return Object.fromEntries(select.map((key) => [key, 0]));
};

const createSearchData = (fields = [], key_search, regexOptions = 'i') => {
	const searchRegex = new RegExp(key_search, regexOptions);
	return fields.map((field) => {
		return { [field]: { $regex: searchRegex } };
	});
};

module.exports = {
	typeOf,
	generateToken,
	convertToObjectIdMongodb,
	createSelectData,
	createSortData,
	createSearchData,
	getUnSelectData,
	getInfoData,
};
