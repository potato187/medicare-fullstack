import { tryCatch } from '@/shared/utils';
import { useEffect, useMemo, useState } from 'react';

export const useQuery = (name = 'data', params, transformData = null, deps = []) => {
	const [data, setData] = useState([]);
	const memorizedData = useMemo(() => (transformData ? transformData(data) : data), [data, ...deps]);

	return [];
};
