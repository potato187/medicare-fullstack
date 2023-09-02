'use strict';
const { typeOf } = require('@/utils');
const { getQueryStrategy } = require('./repository/queryStrategies');

module.exports = (params = [], typeRequest = 'query') => {
	return (req, res, next) => {
		for (const keyParam of params) {
			const valueParam = req[typeRequest][keyParam];
			const type = typeOf(valueParam);
			req[typeRequest][keyParam] = getQueryStrategy(type, valueParam);
		}

		return next();
	};
};
