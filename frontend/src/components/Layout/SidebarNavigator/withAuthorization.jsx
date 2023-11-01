import { Navigate } from 'react-router-dom';
import { useAuth } from 'hooks';

export function withAuthorization(Component = () => null, allowedRoles = []) {
	function WithAuthorization(props) {
		const {
			user: { role },
		} = useAuth();
		const isAuthorized = role && allowedRoles.includes(role);

		if (!isAuthorized) {
			return <Navigate to='../../user-profile' replace />;
		}

		return <Component {...props} />;
	}

	return WithAuthorization;
}
