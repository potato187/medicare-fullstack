import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks';

export function withAuthorization(Component = () => null, allowedRoles = []) {
	function WithAuthorization(props) {
		const auth = useAuth();
		const isAuthorized = auth?.payload?.roleId && allowedRoles.includes(auth.payload.roleId);

		if (!isAuthorized) {
			return <Navigate to='../../user-profile' replace />;
		}

		return <Component {...props} />;
	}

	return WithAuthorization;
}
