const splitStringQuery = (value) => [value.split(',')];

const splitArrayQuery = (values) => values.map((pair) => pair.split(','));

const queryStrategies = {
	string: splitStringQuery,
	array: splitArrayQuery,
};

const getQueryStrategy = (strategyType, values) =>
	strategyType && Object.hasOwn(queryStrategies, strategyType) ? queryStrategies[strategyType](values) : undefined;

module.exports = {
	getQueryStrategy,
};
