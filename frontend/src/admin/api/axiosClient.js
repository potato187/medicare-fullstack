import { authRefreshTokens } from 'admin/redux/slices/auth';
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
			config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
			config.headers['Refresh-Token'] = tokens.refreshToken;
		}

		if (user?.id) {
			config.headers['X-Client-Id'] = user.id;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

let isRefreshToken = false;
let requestsToRefresh = [];

axiosClient.interceptors.response.use(
	(response) => {
		return response.data ? Promise.resolve(response.data) : Promise.resolve(response);
	},
	async (error) => {
		const { config } = error;
		if (!isRefreshToken && error.response.status === 401 && error.response.data.code === 101401 && !config._retry) {
			config._retry = true;
			isRefreshToken = true;
			const { user, tokens } = store.getState()?.auth || {};

			if (user?.id) {
				store
					.dispatch(authRefreshTokens({ id: user.id, tokens }))
					.then(() => {
						requestsToRefresh.forEach((callback) => callback());
					})
					.catch((error) => {
						requestsToRefresh.forEach((callback) => callback(error));
					})
					.finally(() => {
						isRefreshToken = false;
						requestsToRefresh = [];
					});
			}

			return new Promise((resolve, reject) => {
				requestsToRefresh.push((error) => {
					if (error) {
						reject(error);
					} else {
						resolve(axiosClient(config));
					}
				});
			});
		}
		return error.response?.data ? Promise.reject(error.response.data) : Promise.reject(error.response);
	},
);
