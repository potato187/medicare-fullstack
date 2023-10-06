import { authLogin } from 'admin/redux/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Layout } from '../../components';
import { LoginForm } from '../../components/LoginForm';

const REDIRECT_TO_DASHBOARD = '../dashboard';

export default function LoginPage() {
	const { status } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	const handleSubmit = (data) => {
		dispatch(authLogin(data));
	};

	if (status.isLogin) {
		return <Navigate to={REDIRECT_TO_DASHBOARD} />;
	}

	return (
		<Layout>
			<LoginForm onSubmit={handleSubmit} />
		</Layout>
	);
}
