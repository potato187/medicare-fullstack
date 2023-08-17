import { axiosClient } from './axiosClient';
import { AUTH_PATH } from './constant';

export const authApi = {
	async login({ email, password }) {
		return await axiosClient.post(`${AUTH_PATH}/login`, { email, password });
	},
	async loginStatus() {
		return await axiosClient.get(`${AUTH_PATH}/checkLoginStatus`);
	},
	async logout({ email, password }) {
		return await axiosClient.post({ email, password });
	},
};
