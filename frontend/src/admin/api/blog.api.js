import { HEADERS_CONTENT } from 'admin/constant';
import { buildFormData } from 'admin/utilities';
import { axiosClient } from './axiosClient';
import { BLOG_ENDPOINT } from './constant';

export const blogApi = {
	getOneById(id) {
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
		const formData = new FormData();
		buildFormData(formData, body);
		return axiosClient.patch(`${BLOG_ENDPOINT}/${id}`, formData, { headers: HEADERS_CONTENT.formData });
	},

	deleteOneById(id) {
		return axiosClient.delete(`${BLOG_ENDPOINT}/${id}`);
	},
};
