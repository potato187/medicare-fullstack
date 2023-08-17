import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export function withAuth(WrappedComponent) {
	const Wrapper = (props) => {
		const { isLogin } = useSelector((state) => state.auth);

		if (!isLogin) {
			return <Navigate to='../login' replace />;
		}

		return <WrappedComponent {...props} />;
	};

	return Wrapper;
}
