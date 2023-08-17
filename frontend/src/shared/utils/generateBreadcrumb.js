export const generateBreadcrumb = (location) => {
	return location
		.split('/')
		.filter(Boolean)
		.slice(1)
		.map((path, index, source) => ({
			url: source.slice(0, index + 1).join('/'),
			intl: source.slice(0, index + 1).join('.') + '.title',
		}));
};
