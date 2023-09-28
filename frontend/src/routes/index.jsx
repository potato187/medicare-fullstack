import Admin from 'admin';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import Users from 'users';

export const ROOT_PATH = '/';
export const ADMIN_ENDPOINT = 'admin';
export const ADMIN_LOGIN_PATH = 'login';

export const APP_ROUTER = createBrowserRouter([
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
