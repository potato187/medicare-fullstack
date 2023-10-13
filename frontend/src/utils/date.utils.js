import moment from 'moment';

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

export const formatDate = (date, format = 'MM/DD/YYYY') => {
	return moment(new Date(date)).format(format);
};

export const formatDateToDDMMYYYY = (date) => {
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
};
