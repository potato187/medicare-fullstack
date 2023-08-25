/* eslint-disable */
import { useMemo, useState } from 'react';

export const useQuery = (name = 'data', params, transformData = null, deps = []) => {
	const [data, setData] = useState([]);
	const memorizedData = useMemo(() => {
		return transformData ? transformData(data) : data;
	}, [data, ...deps]);

	return [];
};
