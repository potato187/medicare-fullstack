import { axiosClient } from './axiosClient';
import { BLOG_PATH } from './constant';

export const blogApi = {
	getById(id) {
		return axiosClient.get(`${BLOG_PATH}/${id}`);
	},

	createOne(body) {
		return axiosClient.post(`${BLOG_PATH}`, body);
	},

	getByQueryParams(params) {
		return axiosClient.get(`${BLOG_PATH}`, { params });
	},

	updateOneById(id, body) {
		return axiosClient.patch(`${BLOG_PATH}/${id}`, body);
	},

	deleteOneById(id) {
		return axiosClient.delete(`${BLOG_PATH}/${id}`);
	},
};
