export const dataToLabelValueMap = (data, languageId = 'en') => {
	return data.map(({ key, name }) => ({ value: key, label: name[languageId] }));
};

export const keyToLabelReducer = (data, languageId = 'en') => {
	return data.reduce((obj, { key, name }) => {
		obj[key] ??= name[languageId];
		return obj;
	}, {});
};
