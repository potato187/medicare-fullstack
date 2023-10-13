import { PARAMS_OPTIONS_ORDER } from 'constant';
import queryString from 'query-string';

export const createParamsComparator = (paramOrder = []) => {
	return (param1, param2) => {
		return paramOrder.indexOf(param1) - paramOrder.indexOf(param2);
	};
};

export const createURL = (options, config = {}) => {
	return queryString.stringifyUrl(options, {
		sort: createParamsComparator(PARAMS_OPTIONS_ORDER),
		replace: true,
		encode: false,
		...config,
	});
};
