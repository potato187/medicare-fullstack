import { createParamsComparator, typeOf } from '@/utils';
import queryString from 'query-string';
import { PARAMS_OPTIONS_ORDER } from '../constant';

const LANGUAGE_DEFAULT = 'en';

export const flatten = (items = [], parentId = null, depth = 0) => {
	return items.reduce((acc, item, index) => {
		return [...acc, { ...item, parentId, depth, index }, ...flatten(item.children, item.id, depth + 1)];
	}, []);
};

export const findPathFromRoot = (items = [], targetId = null, path = []) => {
	if (!targetId) return [];

	for (const index in items) {
		const currentItem = items[index];
		const newPath = [...path, +index];
		if (currentItem.id === targetId) {
			return newPath;
		}
		if (currentItem?.children?.length) {
			const fount = findPathFromRoot(currentItem.children, targetId, newPath);
			if (fount) return fount;
		}
	}

	return null;
};

export const setDefaultValues = (methods = null, defaultValues = {}) => {
	if (!methods || !defaultValues) return;
	Object.keys(defaultValues).map((key) => {
		methods?.setValue(key, defaultValues[key]);
	});
};

export const compose = (...fns) => {
	return (arg) => {
		return fns.reduce((composed, fn) => {
			fn && fn(composed);
		}, arg);
	};
};

export const createFormData = (object) => {
	const formData = new FormData();
	Object.keys(object).forEach((key) => {
		formData.append(key, object[key]);
	});
	return formData;
};

export const getFileName = (file) => {
	if (!file) return null;
	if (typeOf(file) === 'string') return file;
	return file[0]?.name || '';
};

export const createURL = (options, config = {}) => {
	return queryString.stringifyUrl(options, {
		sort: createParamsComparator(PARAMS_OPTIONS_ORDER),
		replace: true,
		encode: false,
		...config,
	});
};

export const formatDataForSelect = (languageId = LANGUAGE_DEFAULT, key = 'value') => {
	return (data) => {
		return data.map((item) => ({ value: item.id, label: item[`${key}_${languageId}`] }));
	};
};
