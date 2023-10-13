import { axiosClient } from './axiosClient';
import { HTML_CONTENT_ENDPOINT } from './constant';

export const htmlContentApi = {
	getByQueryParams(params) {
		return axiosClient.get(`${HTML_CONTENT_ENDPOINT}`, { params });
	},

	getById(id) {
		return axiosClient.get(`${HTML_CONTENT_ENDPOINT}/${id}`);
	},

	getConfigs() {
		return axiosClient.get(`${HTML_CONTENT_ENDPOINT}/configs`);
	},

	createOne(body) {
		return axiosClient.post(`${HTML_CONTENT_ENDPOINT}`, body);
	},

	updateOneById(id, body) {
		return axiosClient.patch(`${HTML_CONTENT_ENDPOINT}/${id}`, body);
	},

	deleteOneById(id) {
		return axiosClient.delete(`${HTML_CONTENT_ENDPOINT}/${id}`);
	},
};
