import { queryApi } from '@/admin/api';
import { tryCatch } from '@/shared/utils';
import { useEffect, useMemo, useState } from 'react';

export const useQuery = (name = 'data', params, transformData = null, deps = []) => {
	const [data, setData] = useState([]);
	const memorizedData = useMemo(() => (transformData ? transformData(data) : data), [data, ...deps]);

	useEffect(() => {
		const fetchData = async () => {
			const { elements } = await queryApi.getAll(params);
			setData(elements);
		};
		tryCatch(fetchData)();
	}, []);

	return { isLoaded: data.length > 0, [name]: memorizedData, [`set${name}`]: setData };
};
