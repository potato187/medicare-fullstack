import { typeOf } from './functions';

export const flattenLanguage = (nestedMessages, prefix = '') => {
	if (nestedMessages === null) {
		return {};
	}

	return Object.keys(nestedMessages).reduce((messages, key) => {
		const value = nestedMessages[key];
		const prefixedKey = prefix ? `${prefix}.${key}` : key;

		if (typeOf(value) === 'string') {
			Object.assign(messages, { [prefixedKey]: { label: key, value } });
		} else {
			Object.assign(messages, flattenLanguage(value, prefixedKey));
		}

		return messages;
	}, {});
};
