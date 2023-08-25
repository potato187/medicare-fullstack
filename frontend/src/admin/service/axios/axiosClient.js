import { store } from 'admin/redux/store/configureStore';
import axios from 'axios';

export const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_REACT_APP_API_URL,
	timeout: 1000,
});

axiosClient.interceptors.request.use(
	(config) => {
		const { tokens, user } = store.getState()?.auth || {};

		if (tokens) {
			config.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
			config.headers.common['Refresh-Token'] = tokens.refreshToken;
		}

		if (user && user.id) {
			config.headers['X-Client-Id'] = user.id;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axiosClient.interceptors.response.use(
	(response) => {
		return response.data ? Promise.resolve(response.data) : Promise.resolve(response);
	},
	async (error) => {
		return error.response?.data ? Promise.reject(error.response.data) : Promise.reject(error.response);
	},
);
