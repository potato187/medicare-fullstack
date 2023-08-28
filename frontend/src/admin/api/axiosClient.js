import { HEADERS } from 'admin/constant';
import { authLogout, authRefreshTokens } from 'admin/redux/slices/auth';
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
			config.headers[HEADERS.AUTHORIZATION] = `Bearer ${tokens.accessToken}`;
			config.headers[HEADERS.REFRESH_TOKEN] = tokens.refreshToken;
		}

		if (user?.id) {
			config.headers[HEADERS.CLIENT_ID] = user.id;
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
		const httpStatusCode = error.response.status;
		const responseErrorCode = error.response.data.code;

		if (httpStatusCode === 401) {
			const { config } = error;
			const { user, tokens } = store.getState()?.auth || {};

			if (responseErrorCode === 100401) {
				store.dispatch(authLogout({ id: user.id, tokens }));
			}

			if (responseErrorCode === 101401 && !isRefreshToken) {
				isRefreshToken = true;

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
