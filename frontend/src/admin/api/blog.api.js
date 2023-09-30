import { HEADERS_CONTENT } from 'admin/constant';
import { buildFormData } from 'admin/utilities';
import { axiosClient } from './axiosClient';
import { BLOG_ENDPOINT } from './constant';

export const blogApi = {
	getById(id) {
		return axiosClient.get(`${BLOG_ENDPOINT}/${id}`);
	},

	createOne(data) {
		const formData = new FormData();
		buildFormData(formData, data);
		return axiosClient.post(`${BLOG_ENDPOINT}`, formData, { headers: HEADERS_CONTENT.formData });
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
