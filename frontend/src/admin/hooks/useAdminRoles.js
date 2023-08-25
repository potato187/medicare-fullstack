import { useEffect, useMemo, useState } from 'react';
import { tryCatch } from 'admin/utilities';
import { resourceApi } from '../api';

export const useAdminRoles = (languageId = 'en') => {
	const [adminRoles, setAdminRoles] = useState([]);

	const Genders = useMemo(() => {
		return adminRoles.map(({ gender_key, role_name }) => {
			return { label: role_name[languageId], value: gender_key };
		});
	}, [adminRoles, languageId]);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await resourceApi.getAllAdminRole();
			setAdminRoles(metadata);
		})();
	}, []);

	return Genders;
};
