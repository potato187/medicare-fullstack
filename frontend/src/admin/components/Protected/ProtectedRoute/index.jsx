import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ redirectPath = '../login', children }) {
	const { isLogin } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	if (!isLogin) {
		return <Navigate to={redirectPath} replace />;
	}

	return <React.Fragment>{children}</React.Fragment>;
}
