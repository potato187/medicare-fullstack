'use strict';
const { typeOf } = require('@/utils');
const { getQueryStrategy } = require('./repository/queryStrategies');

module.exports = (params = []) => {
	return (req, res, next) => {
		for (const keyParam of params) {
			const valueParam = req.query[keyParam];
			const type = typeOf(valueParam);
			req.query[keyParam] = getQueryStrategy(type, valueParam);
		}
	
		return next();
	};
};
