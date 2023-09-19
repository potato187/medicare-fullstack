const exportAllPage = () => {};

const exportPerPage = ({ queryParams = {} }) => {
	return {
		pagesize: queryParams.pagesize || 25,
		page: queryParams.page || 1,
		specialtyId: queryParams.specialtyId || null,
	};
};

const exportBySelected = ({ Doctors = [] }) => {
	/* 	return Doctors.reduce((hash, { _id, isSelected }) => {
		if (isSelected) {
			hash.push(_id);
		}
		return hash;
	}, []); */
	return [];
};

const exportStrategies = {
	all: exportAllPage,
	page: exportPerPage,
	selected: exportBySelected,
};

export const getHandleExport = (type, ...rest) => {
	return Object.hasOwn(exportStrategies, type) ? exportStrategies[type]({ ...rest }) : null;
};
