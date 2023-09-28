import { axiosClient } from './axiosClient';
import { ADMIN_ENDPOINT, AUTH_ENDPOINT } from './constant';

export const adminApi = {
	async queryAdminByParams(params) {
		return axiosClient.get(`${ADMIN_ENDPOINT}/query`, { params });
	},

	async getOneById(id, params) {
		return axiosClient.get(`${ADMIN_ENDPOINT}/${id}`, { params });
	},

	async updateById(id, data) {
		return axiosClient.patch(`${ADMIN_ENDPOINT}/update/${id}`, data);
	},

	async deleteById(id) {
		return axiosClient.delete(`${ADMIN_ENDPOINT}/delete/${id}`);
	},

	async createOne(body) {
		return axiosClient.post(`${AUTH_ENDPOINT}/sign-up`, body);
	},
};
