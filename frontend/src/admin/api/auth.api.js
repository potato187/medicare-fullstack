import { axiosClient } from './axiosClient';
import { AUTH_PATH } from './constant';

export const authService = {
	async signUp(body) {
		return axiosClient.post(`${AUTH_PATH}/sign-up`, body);
	},
};
