import { axiosClient } from './axiosClient';
import { ADMIN_PATH, AUTH_PATH } from './constant';

export const adminApi = {
	async queryAdminByParams(params) {
		return await axiosClient.get(`${ADMIN_PATH}/query`, { params });
	},

	async updateById(id, data) {
		return await axiosClient.patch(`${ADMIN_PATH}/update/${id}`, data);
	},

	async deleteById(id) {
		return await axiosClient.delete(`${ADMIN_PATH}/delete/${id}`);
	},

	async createOne(body) {
		return await axiosClient.post(`${AUTH_PATH}/sign-up`, body);
	},
};
