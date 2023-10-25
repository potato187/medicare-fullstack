import { HEADERS, APP_URL } from 'constant';
import { authLogout, authRefreshTokens } from 'reduxStores/slices/auth';
import { store } from 'reduxStores/store/configureStore';
import axios from 'axios';

export const axiosClient = axios.create({
	baseURL: `${APP_URL}/v1/api`,
	timeout: 1000,
});

axiosClient.interceptors.request.use(
	(config) => {
		const { tokens, info } = store.getState()?.auth || {};

		if (tokens) {
			config.headers[HEADERS.AUTHORIZATION] = `Bearer ${tokens.accessToken}`;
			config.headers[HEADERS.REFRESH_TOKEN] = tokens.refreshToken;
		}

		if (info?.id) {
			config.headers[HEADERS.CLIENT_ID] = info.id;
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
			const { info, tokens } = store.getState()?.auth || {};

			if (responseErrorCode === 100401) {
				store.dispatch(authLogout({ id: info.id, tokens }));
			}

			if (responseErrorCode === 101401 && !isRefreshToken) {
				isRefreshToken = true;

				if (info?.id) {
					store
						.dispatch(authRefreshTokens({ id: info.id, tokens }))
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
