import { typeOf } from './repos';

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

export const getObjectDiff = (object1, object2) => {
	const flatten1 = flattenObject(object1);
	const flatten2 = flattenObject(object2);
	const diff = getDifferentValues(flatten1, flatten2);
	return reformatObject(diff);
};

export const parseJSON = (value) => {
	try {
		return value === 'undefined' ? undefined : JSON.parse(value ?? '');
	} catch (error) {
		return undefined;
	}
};
