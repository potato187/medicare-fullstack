import moment from 'moment';

export const createWrapperAndAppendToBody = (wrapperId) => {
	const wrapperElement = document.createElement('div');
	wrapperElement.id = wrapperId;
	document.body.append(wrapperElement);
	return wrapperElement;
};

export const downloadExcelFile = (response, filename = 'data.xlsx') => {
	filename += `_${moment().format('DD_MM_YY')}.xlsx`;
	const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
	const url = window.URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', filename);
	link.style.display = 'none';

	document.body.appendChild(link);
	link.click();
	URL.revokeObjectURL(url);
	document.body.removeChild(link);
};
