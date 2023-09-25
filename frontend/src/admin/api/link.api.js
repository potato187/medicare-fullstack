import { axiosClient } from './axiosClient';

export const linkApi = {
	createOne(body) {
		return axiosClient.post(`link`, body);
	},

	getAll(params) {
		return axiosClient.get(`link`, { params });
	},

	getOneById(id) {
		return axiosClient.get(`link/${id}`);
	},

	updateOneById(id, body) {
		return axiosClient.patch(`link/${id}`, body);
	},

	sortable(body) {
		return axiosClient.patch(`link/sortable`, body);
	},

	deleteByIds(body) {
		return axiosClient.post(`link/delete`, body);
	},
};
