const exportAllPage = () => {
	return {};
};

const exportPerPage = (args) => {
	const { queryParams } = args;
	return {
		pagesize: queryParams.pagesize || 25,
		page: queryParams.page || 1,
		specialtyId: queryParams.specialtyId || null,
	};
};

const exportBySelected = (args) => {
	const { Doctors } = args;
	const ids = Doctors.reduce((hash, { _id, isSelected }) => {
		if (isSelected) {
			hash.push(_id);
		}
		return hash;
	}, []);

	return { ids };
};

const exportStrategies = {
	all: exportAllPage,
	page: exportPerPage,
	selected: exportBySelected,
};

export const getHandleExport = (type, args = {}) => {
	return Object.hasOwn(exportStrategies, type) ? exportStrategies[type](args) : null;
};
