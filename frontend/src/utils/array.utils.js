export const mapData = (data = [], languageId = 'en') => {
	return data.map(({ _id, name }) => ({ value: _id, label: name[languageId] }));
};

export const findItemByLabel = (arr, valueCompare, defaultValue = '') => {
	if (!valueCompare) return defaultValue;
	const foundItem = arr.find((item) => item.label.toLowerCase() === valueCompare.toLowerCase());
	return foundItem !== undefined ? foundItem : defaultValue;
};
