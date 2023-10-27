import { PAGESIZE_DEFAULT, PAGESIZE_MAX } from 'constant';

export const debounce = (func, timeout = 300) => {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
};

export const clampPageSize = (pageSize, min = PAGESIZE_DEFAULT, max = PAGESIZE_MAX) => {
	const parsedPageSize = parseInt(pageSize, 10) || min;
	return Math.min(Math.max(parsedPageSize, min), max);
};

export const clampPage = (page, min = 1) => Math.max(parseInt(page, 10) || min, min);
