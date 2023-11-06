export const mapData = (data, languageId = 'en') => {
	return data.map(({ key, name }) => ({ value: key, label: name[languageId] }));
};
