import { Navigate, createBrowserRouter } from 'react-router-dom';
import Admin from '@/admin';
import Users from '@/users';

export const ROOT_PATH = '/';
export const ADMIN_PATH = 'admin';
export const ADMIN_LOGIN_PATH = 'login';

const APP_ROUTER = createBrowserRouter([
	{
		index: true,
		element: <Users />,
	},
	{
		path: 'admin/*',
		element: <Admin />,
	},
	{
		path: '*',
		element: <Navigate to='' />,
	},
]);

export default APP_ROUTER;
