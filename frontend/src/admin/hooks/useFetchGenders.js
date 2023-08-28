import { useEffect, useMemo, useState } from 'react';
import { tryCatch } from 'admin/utilities';
import { resourceApi } from '../api';

export const useFetchGenders = (languageId = 'en') => {
	const [genders, setGenders] = useState([]);

	const Genders = useMemo(() => {
		return genders.map(({ key, name }) => {
			return { label: name[languageId], value: key };
		});
	}, [genders, languageId]);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await resourceApi.getAll('gender');
			setGenders(metadata);
		})();
	}, []);

	return Genders;
};
