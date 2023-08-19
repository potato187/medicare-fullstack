import { logout } from '@/admin/redux/slices/authSlice';
import { store } from '@/admin/redux/store/configureStore';
import axios from 'axios';

export const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_REACT_APP_API_URL,
	timeout: 1000,
});

axiosClient.interceptors.request.use(
	function (config) {
		const { accessToken = '', id: clientId = '' } = store.getState()?.auth?.payload;
		if (accessToken) {
			config.headers['Authorization'] = `Bearer ${accessToken}`;
		}
		if (clientId) {
			config.headers['X-Client-Id'] = clientId;
		}

		return config;
	},
	function (error) {
		return Promise.reject(error);
	},
);

axiosClient.interceptors.response.use(
	function (response) {
		return response.data?.metadata ? Promise.resolve(response.data.metadata) : Promise.resolve(response);
	},
	function (error) {
		if (error?.response.status === 401) {
			store.dispatch(logout());
		}
		console.log(error);
		return error?.response?.data?.error ? Promise.reject(error.response.data.error) : Promise.reject(error);
	},
);
