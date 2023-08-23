import { axiosClient } from './axios/axiosClient';
import { AUTH_PATH } from './constant';

export const authService = {
	async signUp(body) {
		return await axiosClient.post(`${AUTH_PATH}/sign-up`, body);
	},
	async login(body) {
		return await axiosClient.post(`${AUTH_PATH}/login`, body);
	},
	async logout() {
		return await axiosClient.get(`${AUTH_PATH}/logout`);
	},

	async refreshTokens(id) {
		return await axiosClient.get(`${AUTH_PATH}/refresh-tokens/${id}`);
	},
};
