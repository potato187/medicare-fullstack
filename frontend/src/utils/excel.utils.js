import * as XLSX from 'xlsx';

export const readFileExcel = async (file) => {
	if (!file) return [];
	const data = await file.arrayBuffer();
	const workbook = XLSX.read(data);
	const worksheet = workbook.Sheets[workbook.SheetNames[0]];
	return XLSX.utils.sheet_to_json(worksheet);
};
