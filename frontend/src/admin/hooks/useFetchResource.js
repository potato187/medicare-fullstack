import { resourceApi } from 'admin/api';
import { tryCatch } from 'admin/utilities';
import { useEffect, useState, useMemo } from 'react';

export const useFetchResource = ({ endpoint, languageId, formatter }) => {
	const [data, setData] = useState([]);

	const dataMemorized = useMemo(() => {
		const formattedData = formatter
			? formatter(data)
			: data.map(({ name, key }) => {
					return { label: name[languageId], value: key };
			  });
		return formattedData;
	}, [data, languageId, formatter]);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await resourceApi.getAll(endpoint);
			setData(metadata);
		})();
	}, [endpoint]);

	return dataMemorized;
};
