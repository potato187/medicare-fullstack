import { axiosClient } from './axiosClient';
import { AUTH_PATH } from './constant';

export const authApi = {
	async signUp(body) {
		return await axiosClient.post(`${AUTH_PATH}/sign-up`, body);
	},
	async login(body) {
		return await axiosClient.post(`${AUTH_PATH}/login`, body);
	},
	async loginStatus() {
		return await axiosClient.get(`${AUTH_PATH}/checkLoginStatus`);
	},
	async logout(body) {
		return await axiosClient.post(body);
	},
};
