import { axiosClient } from './axiosClient';
import { HTML_CONTENT_ENDPOINT } from './constant';

export const htmlContentApi = {
	async getByQueryParams(params) {
		return axiosClient.get(`${HTML_CONTENT_ENDPOINT}`, { params });
	},

	async getById(id) {
		return axiosClient.get(`${HTML_CONTENT_ENDPOINT}/${id}`);
	},

	async getConfigs() {
		return axiosClient.get(`${HTML_CONTENT_ENDPOINT}/configs`);
	},

	async createOne(body) {
		return axiosClient.post(`${HTML_CONTENT_ENDPOINT}`, body);
	},

	async updateOneById(id, body) {
		return axiosClient.patch(`${HTML_CONTENT_ENDPOINT}/${id}`, body);
	},

	async deleteOneById(id) {
		return axiosClient.delete(`${HTML_CONTENT_ENDPOINT}/${id}`);
	},
};
