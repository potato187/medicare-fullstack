const { typeOf } = require('@/utils');
const { getQueryStrategy } = require('./repository/queryStrategies');

module.exports = (params = [], typeRequest = 'query') => {
	return (req, res, next) => {
		params.forEach((keyParam) => {
			const valueParam = req[typeRequest][keyParam];
			const type = typeOf(valueParam);
			req[typeRequest][keyParam] = getQueryStrategy(type, valueParam) || [];
		});

		next();
	};
};
