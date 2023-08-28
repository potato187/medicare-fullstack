import { useEffect, useMemo, useState } from 'react';
import { tryCatch } from 'admin/utilities';
import { resourceApi } from '../api';

export const useFetchAdminRoles = (languageId = 'en') => {
	const [adminRoles, setAdminRoles] = useState([]);

	const Genders = useMemo(() => {
		return adminRoles.map(({ role_key, role_name }) => {
			return { label: role_name[languageId], value: role_key };
		});
	}, [adminRoles, languageId]);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await resourceApi.getAll('role', {
				sort: [['gender_key', 'asc']],
				select: ['role_name', 'role_key'],
			});
			setAdminRoles(metadata);
		})();
	}, []);

	return Genders;
};
