import Admin from 'admin';
import { Navigate, createBrowserRouter } from 'react-router-dom';

export const APP_ROUTER = createBrowserRouter([
	{
		path: 'admin/*',
		element: <Admin />,
	},
	{
		path: '*',
		element: <Navigate to='admin' />,
	},
]);
