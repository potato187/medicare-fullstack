'use strict';
const ExcelJS = require('exceljs');

const fieldsTranslation = {
	fullName: {
		header: {
			vi: 'Họ & Tên',
			en: 'Full Name',
		},
		width: 25,
	},
	email: {
		header: {
			vi: 'Email',
			en: 'Email',
		},
		width: 25,
	},
	phone: {
		header: {
			vi: 'Số điện thoại',
			en: 'Phone',
		},
		width: 20,
	},
	address: {
		header: {
			vi: 'Địa chỉ',
			en: 'Address',
		},
		width: 20,
	},
	gender: {
		header: {
			vi: 'Giới tính',
			en: 'Gender',
		},
		width: 20,
	},
	position: {
		header: {
			vi: 'Chức danh',
			en: 'Position',
		},
		width: 20,
	},
	specialty: {
		header: {
			vi: 'Chuyên khoa',
			en: 'Specialty',
		},
		width: 20,
	},
};

const exportWorkbook = (data, languageId) => {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('sheet 1');

	const columns = data.reduce((acc, obj) => (acc = Object.getOwnPropertyNames(obj)), []);

	worksheet.columns = columns.map((el) => {
		return { key: el, ...fieldsTranslation[el], header: fieldsTranslation[el].header[languageId] };
	});

	worksheet.addRows(data);

	return workbook;
};

module.exports = {
	exportWorkbook,
};
