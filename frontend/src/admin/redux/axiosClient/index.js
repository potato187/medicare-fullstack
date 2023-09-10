import axios from 'axios';

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_REACT_APP_API_URL,
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
