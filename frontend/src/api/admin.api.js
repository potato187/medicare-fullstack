import { axiosClient } from './axiosClient';
import { ADMIN_ENDPOINT, AUTH_ENDPOINT } from './constant';

export const adminApi = {
	queryAdminByParams(params) {
		return axiosClient.get(`${ADMIN_ENDPOINT}/query`, { params });
	},

	getOneById(id, params) {
		return axiosClient.get(`${ADMIN_ENDPOINT}/${id}`, { params });
	},

	updateById(id, data) {
		return axiosClient.patch(`${ADMIN_ENDPOINT}/update/${id}`, data);
	},

	deleteById(id) {
		return axiosClient.delete(`${ADMIN_ENDPOINT}/delete/${id}`);
	},

	createOne(body) {
		return axiosClient.post(`${AUTH_ENDPOINT}/sign-up`, body);
	},

	changePassword(id, body) {
		return axiosClient.patch(`${AUTH_ENDPOINT}/change-password/${id}`, body);
	},
};
