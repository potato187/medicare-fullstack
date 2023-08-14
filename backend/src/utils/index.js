'use strict';
const { Types } = require('mongoose');
const crypto = require('node:crypto');

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

const getUnSelectData = (select = []) => {
	return Object.fromEntries(select.map((key) => [key, 0]));
};

module.exports = {
	typeOf,
	generateToken,
	convertToObjectIdMongodb,
	createSelectData,
	getUnSelectData,
};
