import { axiosClient } from './axiosClient';
import { AUTH_ENDPOINT } from './constant';

export const authService = {
	async signUp(body) {
		return axiosClient.post(`${AUTH_ENDPOINT}/sign-up`, body);
	},
};
