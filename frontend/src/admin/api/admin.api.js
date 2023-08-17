import { createFormData } from '../utilities';
import { axiosClient } from './axiosClient';
import { ADMINS_PATH } from './constant';

export const adminApi = {
	getAll(params) {
		return axiosClient.get(`${ADMINS_PATH}/get`, { params });
	},

	createOne(data) {
		const formData = createFormData(data);
		return axiosClient.post(`${ADMINS_PATH}/create`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	},

	updateOne(data) {
		const formData = createFormData(data);
		formData.delete('createdAt');
		return axiosClient.put(`${ADMINS_PATH}/update`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	},

	deleteOne(id) {
		return axiosClient.delete(`${ADMINS_PATH}/delete/${id}`);
	},
};
