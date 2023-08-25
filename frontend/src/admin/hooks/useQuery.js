/* eslint-disable */
import { useEffect, useMemo, useState } from 'react';
import { tryCatch } from '@/shared/utils';

export const useQuery = (name = 'data', params, transformData = null, deps = []) => {
	const [data, setData] = useState([]);
	const memorizedData = useMemo(() => {
		return transformData ? transformData(data) : data;
	}, [data, ...deps]);

	return [];
};
