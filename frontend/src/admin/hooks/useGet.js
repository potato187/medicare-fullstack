import { axiosClient } from 'admin/api';
import { tryCatch } from 'admin/utilities';
import { useEffect, useState } from 'react';

export const useGet = ({ endPoint = '' }) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		tryCatch(async () => {
			if (endPoint) {
				const { metadata } = await axiosClient.get(endPoint);
				setData(metadata);
			}
		})();
	}, [endPoint]);

	return data;
};
