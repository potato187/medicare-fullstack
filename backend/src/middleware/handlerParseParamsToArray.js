'use strict';
const { typeOf } = require('@/utils');

const handlerParseParamsToArray = (params = []) => {
	return (req, res, next) => {
		for (const keyParam of params) {
			const valueParam = req.query[keyParam];

			if (typeOf(valueParam) === 'string') {
				req.query[keyParam] = [valueParam.split(',')];
			}

			if (typeOf(valueParam) === 'array') {
				req.query[keyParam] = valueParam.map((pairKey) => pairKey.split(','));
			}
		}
		return next();
	};
};

module.exports = handlerParseParamsToArray;
