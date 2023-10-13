import { useAuth } from 'hooks';
import { Navigate } from 'react-router-dom';

export function NavigateUser() {
	const { status } = useAuth();

	if (status?.isLogin) {
		return <Navigate to='./dashboard' />;
	}

	return <Navigate replace to='./login' />;
}
