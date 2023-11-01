const UPLOAD_FIELDS = [
	{ name: 'common_information[logo_header][value][0]', maxCount: 1 },
	{ name: 'common_information[logo_footer][value][0]', maxCount: 1 },
	{ name: 'common_information[og_image][value][0]', maxCount: 1 },
	{ name: 'common_information[favicon][value][0]', maxCount: 1 },
];

module.exports = {
	UPLOAD_FIELDS,
};
