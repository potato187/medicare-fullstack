import { useAuth } from '@/hooks';
import { Navigate } from 'react-router-dom';

export function withAuthorization(Component = () => null, allowedRoles = []) {
	const WithAuthorization = (props) => {
		const auth = useAuth();
		const isAuthorized = auth?.payload?.roleId && allowedRoles.includes(auth.payload.roleId);

		if (!isAuthorized) {
			return <Navigate to='../../user-profile' replace />;
		}

		return <Component {...props} />;
	};

	return WithAuthorization;
}
