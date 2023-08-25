import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export function withAuth(WrappedComponent) {
	function Wrapper(props) {
		const { status } = useSelector((state) => state.auth);

		if (!status.isLogin) {
			return <Navigate to='../login' replace />;
		}

		return <WrappedComponent {...props} />;
	}

	return Wrapper;
}
