import { tryCatch } from '@/shared/utils';
import { useEffect, useMemo, useState } from 'react';
import { resourceApi } from '../api';

export const useAdminRoles = (languageId = 'en') => {
	const [adminRoles, setAdminRoles] = useState([]);

	const AdminRoles = useMemo(() => {
		return adminRoles.map(({ role_key, role_name }) => ({ label: role_name[languageId], value: role_key }));
	}, [adminRoles, languageId]);

	useEffect(() => {
		tryCatch(async () => {
			const metadata = await resourceApi.getAllAdminRole();
			setAdminRoles(metadata);
		})();
	}, []);

	return AdminRoles;
};
