import moment from 'moment';
import queryString from 'query-string';
import { PAGINATION_OPTIONS } from 'admin/constant';

export const createWrapperAndAppendToBody = (wrapperId) => {
	const wrapperElement = document.createElement('div');
	wrapperElement.id = wrapperId;
	document.body.append(wrapperElement);
	return wrapperElement;
};

export const typeOf = (value) => {
	return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};

export const getFlatParams = (params = '', DEFAULT_PARAMS) => {
	if (!params) return DEFAULT_PARAMS;
	return Array.isArray(params) ? params.join(',') : params;
};

export const sortQueryParams = (haystack = []) => {
	return (param1, param2) => {
		return haystack.indexOf(param1) - haystack.indexOf(param2);
	};
};

export const createParamsComparator = (paramOrder = []) => {
	return (param1, param2) => {
		return paramOrder.indexOf(param1) - paramOrder.indexOf(param2);
	};
};

export const setQueryParams = (
	pathName = '',
	navigate = () => {
		return null;
	},
	haystack = PAGINATION_OPTIONS,
) => {
	const sortedQueryParams = sortQueryParams(haystack);
	const direct = navigate;
	const locationPathName = pathName;
	return (queryParams = {}, newQueryParams) => {
		const to = queryString.stringifyUrl(
			{ url: locationPathName, query: { ...queryParams, ...newQueryParams } },
			{
				replace: true,
				sort: sortedQueryParams,
				encode: false,
			},
		);
		direct(to);
	};
};

export const formatDate = (date, format = 'DD/MM/YYYY') => {
	return moment(date).format(format);
};

export const downloadExcelFile = (response, filename = 'data.xlsx') => {
	filename += `_${moment().format('DD_MM_YY')}.xlsx`;
	const url = window.URL.createObjectURL(new Blob([response]));
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', filename);
	link.style.display = 'none';
	document.body.appendChild(link);
	link.click();
	URL.revokeObjectURL(url);
	document.body.removeChild(link);
};

export const isValidExtension = (extensions = []) => {
	return (filename) => {
		if (!filename || !filename.trim().length) return false;
		const ext = filename.split('.').pop().toLowerCase();
		return extensions.includes(ext);
	};
};

export const filterWeekends = (date) => {
	const day = date.getDay();
	return day !== 0;
};

export const formatPhone = (phoneNumber) => {
	return phoneNumber.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3');
};

export const debounce = (func, timeout = 300) => {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
};

export const generateSlug = (str = '') => {
	const slug = str.toLowerCase().replace(/\W+/g, '-');
	return slug.replace(/^-+|-+$/g, '');
};

export const firstCapitalize = (s) => {
	return s[0].toUpperCase() + s.slice(1);
};

export const parseParamToArray = (param = []) => {
	if (typeOf(param) === 'string') return [param.split(',')];
	return param.map(parseParamToArray);
};
