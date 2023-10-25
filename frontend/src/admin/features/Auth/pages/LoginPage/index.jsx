import { PATH_IMAGES } from 'constant';
import { authLogin } from 'reduxStores/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Navigate } from 'react-router-dom';
import { Layout, LoginForm } from '../../components';

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
			<div className='container'>
				<div className='text-center'>
					<NavLink to='' className='d-block mb-3'>
						<img height='20' width='20' src={PATH_IMAGES.LOGO_SM} alt='' />
					</NavLink>
					<p className='fw-700 text-white-50 mb-3'>Premium Admin & Dashboard Template</p>
				</div>
				<div className='row'>
					<div className='col-12 col-md-6 offset-md-3 col-xl-4 offset-xl-4'>
						<LoginForm onSubmit={handleSubmit} />
					</div>
				</div>
			</div>
		</Layout>
	);
}
