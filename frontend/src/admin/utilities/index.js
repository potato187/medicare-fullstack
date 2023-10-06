import { toast } from 'react-toastify';
import queryString from 'query-string';
import { createParamsComparator, typeOf } from 'utils';
import moment from 'moment';
import { PARAMS_OPTIONS_ORDER } from '../constant';

const LANGUAGE_DEFAULT = 'en';

export const flatten = (items = [], parentId = null, depth = 0) => {
	return items.reduce((acc, item, index) => {
		return [
			...acc,
			{
				...item,
				parentId,
				depth,
				index,
			},
			...flatten(item.children, item.id, depth + 1),
		];
	}, []);
};

export const findPathFromRoot = (items = [], targetId = null, path = []) => {
	if (!targetId) return [];
	for (let index = 0, len = items.length; index < len; index++) {
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
	if (!methods || !Object.keys(defaultValues).length) return;
	Object.entries(defaultValues).forEach(([key, value]) => {
		methods.setValue(key, value);
	});
};

export const compose = (...fns) => {
	return (arg) => {
		fns.forEach((fn) => {
			if (fn) {
				fn(arg);
			}
		});
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
		return data.map((item) => {
			return { value: item.id, label: item[`${key}_${languageId}`] };
		});
	};
};

export const generateBreadcrumb = (location) => {
	return location
		.split('/')
		.filter(Boolean)
		.slice(1)
		.map((path, index, source) => {
			return {
				url: source.slice(0, index + 1).join('/'),
				intl: `${source.slice(0, index + 1).join('.')}.title`,
			};
		});
};

export const tryCatchAndToast = (callback, languageId = 'en', finallyCallback = null) => {
	return async (...props) => {
		try {
			await Promise.resolve(callback(...props));
		} catch (error) {
			/* eslint  no-console: "off" */
			console.log(error);
			const errorMessage = error?.message?.[languageId] || 'An error occurred.';
			toast.error(errorMessage);
		} finally {
			if (finallyCallback) {
				finallyCallback();
			}
		}
	};
};

export const tryCatch = (callback, finallyCallback = null) => {
	return async (...props) => {
		try {
			await Promise.resolve(callback(...props));
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		} finally {
			if (finallyCallback) {
				finallyCallback();
			}
		}
	};
};

export const createUpdateBody = (methods, data) => {
	const { dirtyFields } = methods.formState;
	const updateBody = Object.keys(dirtyFields).reduce((hash, key) => {
		hash[key] = data[key];
		return hash;
	}, {});

	return updateBody;
};

export const flattenObject = (object = null, prefix = '') => {
	if (object === null || object === undefined) {
		return {};
	}

	return Object.entries(object).reduce((obj, [key, value]) => {
		const prefixKey = prefix ? `${prefix}.${key}` : key;

		if (typeOf(value) !== 'object') {
			// eslint-disable-next-line no-param-reassign
			obj[prefixKey] = value;
		}

		if (typeOf(value) === 'object') {
			Object.assign(obj, flattenObject(value, prefixKey));
		}

		return obj;
	}, {});
};

export const compareValues = (valueA, valueB) => {
	const typeA = typeof valueA;
	const typeB = typeof valueB;

	if (typeA !== typeB) return false;

	if (typeA === 'object' && typeB === 'object') {
		return JSON.stringify(valueA) === JSON.stringify(valueB);
	}

	return valueA === valueB;
};

export const getDifferentValues = (beforeObject, afterObject) => {
	const flattenedBeforeObject = flattenObject(beforeObject);
	const flattenedAfterObject = flattenObject(afterObject);

	return Object.entries(flattenedAfterObject).reduce((hash, [key, value]) => {
		if (Object.hasOwn(flattenedBeforeObject, key) && !compareValues(flattenedBeforeObject[key], value)) {
			hash[key] = value;
		}
		return hash;
	}, {});
};

export const reformatObject = (flattenObject = {}) => {
	const result = {};

	Object.entries(flattenObject).forEach(([key, value]) => {
		let temp = result;
		const keys = key.split('.');

		for (let i = 0; i < keys.length - 1; i++) {
			if (!temp[keys[i]]) {
				temp[keys[i]] = {};
			}
			temp = temp[keys[i]];
		}

		temp[keys[keys.length - 1]] = value;
	});

	return result;
};

export const getObjectDiff = (object1, object2) => {
	const flatten1 = flattenObject(object1);
	const flatten2 = flattenObject(object2);
	const diff = getDifferentValues(flatten1, flatten2);
	return reformatObject(diff);
};

export const extractFirstNameLastName = (fullName) => {
	const names = fullName.split(' ');
	const lastName = names.slice(-1).join('').trim();
	const firstName = names.slice(0, -1).join(' ').trim();
	return { firstName, lastName };
};

export const showToastMessage = (message, languageId, type = 'success') => {
	toast[type](message[languageId]);
	return true;
};

export const formatISODate = (dateString) => {
	return moment(new Date(dateString)).toISOString();
};

export const isDateInRange = (date, startDate, endDate = null) => {
	const cDate = moment(date);
	const sDate = moment(startDate);
	const eDate = endDate ? moment(endDate) : null;
	if (eDate) {
		return cDate.isBetween(sDate, eDate, null, []);
	}

	return cDate.isSameOrAfter(sDate, 'day');
};

export const mapData = (data = [], languageId = 'en') => {
	return data.map(({ _id, name }) => ({ value: _id, label: name[languageId] }));
};

export const buildFormData = (formData, data, parentKey) => {
	if (
		data &&
		typeof data === 'object' &&
		!(data instanceof Date) &&
		!(data instanceof File) &&
		!(data instanceof Blob)
	) {
		Object.keys(data).forEach((key) => {
			buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
		});
	} else {
		const value = data == null ? '' : data;
		formData.append(parentKey, value);
	}
};

export const parseJSON = (value) => {
	try {
		return value === 'undefined' ? undefined : JSON.parse(value ?? '');
	} catch {
		console.log('parsing error on', { value });
		return undefined;
	}
};
