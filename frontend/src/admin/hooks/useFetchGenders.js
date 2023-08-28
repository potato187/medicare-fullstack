import { useEffect, useMemo, useState } from 'react';
import { tryCatch } from 'admin/utilities';
import { resourceApi } from '../api';

export const useFetchGenders = (languageId = 'en') => {
	const [genders, setGenders] = useState([]);

	const Genders = useMemo(() => {
		return genders.map(({ gender_key, gender_name }) => {
			return { label: gender_name[languageId], value: gender_key };
		});
	}, [genders, languageId]);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await resourceApi.getAll('gender', {
				sort: [['gender_key', 'asc']],
				select: ['gender_name', 'gender_key'],
			});
			setGenders(metadata);
		})();
	}, []);

	return Genders;
};
