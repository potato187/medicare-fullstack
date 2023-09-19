import { resourceApi } from 'admin/api';
import { tryCatch } from 'admin/utilities';
import { useEffect, useState } from 'react';

export const useFetch = ({ endpoint }) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await resourceApi.getAll(endpoint);
			setData(metadata);
		})();
	}, [endpoint]);

	return data;
};
