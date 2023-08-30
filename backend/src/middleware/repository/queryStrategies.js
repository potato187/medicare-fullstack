'use strict';

const splitStringQuery = (value) => {
	return [value.split(',')];
};

const splitArrayQuery = (values) => {
	return values.map((pair) => pair.split(','));
};

const queryStrategies = {
	string: splitStringQuery,
	array: splitArrayQuery,
};

const getQueryStrategy = (strategyType, values) => {
	return strategyType && Object.hasOwn(queryStrategies, strategyType)
		? queryStrategies[strategyType](values)
		: undefined;
};

module.exports = {
	getQueryStrategy,
};
