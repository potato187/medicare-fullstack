import { useEffect, useMemo, useState } from 'react';
import { tryCatch } from 'admin/utilities';
import { resourceApi } from '../api';

export const useFetchSpecialties = (languageId = 'en') => {
	const [specialties, setSpecialties] = useState([]);

	const Specialties = useMemo(() => {
		return specialties.map(({ name, _id }) => {
			return { label: name[languageId], value: _id };
		});
	}, [specialties, languageId]);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await resourceApi.getAll('specialty', { sort: [['key', 'asc']], select: ['_id', 'name'] });
			setSpecialties(metadata);
		})();
	}, []);

	return Specialties;
};
