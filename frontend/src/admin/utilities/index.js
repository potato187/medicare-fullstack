import { toast } from 'react-toastify';
import queryString from 'query-string';
import { createParamsComparator, typeOf } from 'utils';
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
	if (!methods || !defaultValues) return;

	Object.keys(defaultValues).forEach((key) => {
		methods?.setValue(key, defaultValues[key]);
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

export const getDifferentValues = (beforeObject, afterObject) => {
	return Object.entries(afterObject).reduce((hash, [key, value]) => {
		if (typeOf(value) !== 'object' && value !== beforeObject[key]) {
			hash[key] = value;
		}
		if (JSON.stringify(value) !== JSON.stringify(beforeObject[key])) {
			hash[key] = value;
		}

		if (!beforeObject[key]) {
			hash[key] = value;
		}

		return hash;
	}, {});
};
