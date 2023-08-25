import { useEffect, useMemo, useState } from 'react';
import { tryCatch } from '@/shared/utils';
import { resourceApi } from '../service';

export const useGenders = (languageId = 'en') => {
	const [genders, setGenders] = useState([]);

	const Genders = useMemo(() => {
		return genders.map(({ gender_key, gender_name }) => {
			return { label: gender_name[languageId], value: gender_key };
		});
	}, [genders, languageId]);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await resourceApi.getAllGender();
			setGenders(metadata);
		})();
	}, []);

	return Genders;
};
