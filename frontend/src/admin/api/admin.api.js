import { createFormData } from '../utilities';
import { axiosClient } from './axiosClient';
import { ADMIN_PATH } from './constant';

export const adminApi = {
	getAll(params) {
		delete params.totalPages;
		return axiosClient.get(`${ADMIN_PATH}/query`, { params });
	},

	getTotalPages() {
		return axiosClient.get(`${ADMIN_PATH}/get-total-pages`);
	},

	createOne(data) {
		const formData = createFormData(data);
		return axiosClient.post(`${ADMIN_PATH}/create`, formData);
	},

	updateOne(data) {
		const formData = createFormData(data);
		formData.delete('createdAt');
		return axiosClient.put(`${ADMIN_PATH}/update`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	},

	deleteOne(id) {
		return axiosClient.delete(`${ADMIN_PATH}/delete/${id}`);
	},
};
