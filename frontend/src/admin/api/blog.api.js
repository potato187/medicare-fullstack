import { axiosClient } from './axiosClient';
import { BLOG_ENDPOINT } from './constant';

export const blogApi = {
	getById(id) {
		return axiosClient.get(`${BLOG_ENDPOINT}/${id}`);
	},

	createOne(body) {
		return axiosClient.post(`${BLOG_ENDPOINT}`, body);
	},

	getByQueryParams(params) {
		return axiosClient.get(`${BLOG_ENDPOINT}`, { params });
	},

	updateOneById(id, body) {
		return axiosClient.patch(`${BLOG_ENDPOINT}/${id}`, body);
	},

	deleteOneById(id) {
		return axiosClient.delete(`${BLOG_ENDPOINT}/${id}`);
	},
};
