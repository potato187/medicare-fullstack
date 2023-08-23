import { axiosClient } from './axios/axiosClient';
import { ADMIN_PATH } from './constant';

export const adminApi = {
	queryAdminByParams(params) {
		return axiosClient.get(`${ADMIN_PATH}/query`, { params });
	},

	updateById(id, data) {
		console.log(data);
		return axiosClient.patch(`${ADMIN_PATH}/update/${id}`, data);
	},

	deleteById(id) {
		return axiosClient.delete(`${ADMIN_PATH}/delete/${id}`);
	},
};
