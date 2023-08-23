import { store } from '@/admin/redux/store/configureStore';
import axios from 'axios';
import { authService } from '../auth.service';
import { authRefreshTokens } from '@/admin/redux/slices/authSlice';

export const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_REACT_APP_API_URL,
	timeout: 1000,
});

axiosClient.interceptors.request.use(
	(config) => {
		const { accessToken, refreshToken, id: clientId } = store.getState()?.auth?.payload;

		if (accessToken && refreshToken) {
			config.headers['Authorization'] = `Bearer ${accessToken}`;
			config.headers['Refresh-Token'] = refreshToken;
		}

		if (clientId) {
			config.headers['X-Client-Id'] = clientId;
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

		if (error.response.status === 401 && error.response.data.code === 101401 && !config._retry) {
			if (!isRefreshToken) {
				isRefreshToken = true;
				config._retry = true;

				const { id, accessToken, refreshToken } = store.getState()?.auth?.payload;

				authService
					.refreshTokens(id)
					.then(({ metadata }) => {
						if (
							(accessToken !== metadata.accessToken && refreshToken === metadata.refreshToken) ||
							(accessToken !== metadata.accessToken && refreshToken !== metadata.refreshToken)
						) {
							store.dispatch(authRefreshTokens(metadata));
						}

						requestsToRefresh.forEach((callback) => callback());
					})
					.catch((error) => requestsToRefresh.forEach((callback) => callback(error)))
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
