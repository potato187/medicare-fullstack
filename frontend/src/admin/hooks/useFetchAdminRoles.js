import { useEffect, useMemo, useState } from 'react';
import { tryCatch } from 'admin/utilities';
import { resourceApi } from '../api';

export const useFetchAdminRoles = (languageId = 'en') => {
	const [adminRoles, setAdminRoles] = useState([]);

	const Genders = useMemo(() => {
		return adminRoles.map(({ key, name }) => {
			return { label: name[languageId], value: key };
		});
	}, [adminRoles, languageId]);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await resourceApi.getAll('role');
			setAdminRoles(metadata);
		})();
	}, []);

	return Genders;
};
