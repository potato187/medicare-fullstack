/* eslint-disable */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { tryCatch } from '@/shared/utils';
import { specialtiesApi } from '../service';

export const useFetchSpecialty = (params = {}) => {
	const { entity = 'Doctors' } = params;
	const language = params.language || 'en';
	const [specialties, setSpecialties] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);

	const updateSpecialties = useCallback((newData) => {
		setSpecialties(newData);
	}, []);

	const memorizedOptions = useMemo(() => {
		const key = `total${entity}`;
		return specialties.map((specialty) => {
			return {
				value: specialty.value,
				label: specialty[language],
				count: specialty[key],
				disabled: specialty[key] === 0,
			};
		}, []);
	}, [specialties, language]);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await specialtiesApi.getAll(params);
			setSpecialties(data);
		};
		tryCatch(fetchData, language, () => {
			return setIsLoaded(true);
		})();
	}, []);

	return { isLoaded, memorizedOptions, updateSpecialties };
};
