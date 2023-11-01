export const formatPhone = (phoneNumber = '') => {
	if (!phoneNumber) return '0000 000 000';
	return phoneNumber.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3');
};

export const capitalizeFirstLetter = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const extractFirstNameLastName = (fullName) => {
	if (!fullName) return '';
	const names = fullName.split(' ');
	const lastName = names.slice(-1).join('').trim();
	const firstName = names.slice(0, -1).join(' ').trim();
	return { firstName, lastName };
};

export const firstCapitalize = (s) => {
	return s[0].toUpperCase() + s.slice(1);
};
