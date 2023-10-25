import axios from 'axios';
import { APP_URL } from 'constant';

const axiosClient = axios.create({
	baseURL: `${APP_URL}/v1/api`,
	timeout: 1000,
});

axiosClient.interceptors.request.use(
	(config) => {
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
	(error) => {
		return error.response?.data ? Promise.reject(error.response.data) : Promise.reject(error.response);
	},
);

export default axiosClient;
