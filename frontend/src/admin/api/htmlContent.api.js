import { axiosClient } from './axiosClient';
import { HTML_CONTENT_PATH } from './constant';

export const htmlContentApi = {
	async getByQueryParams(params) {
		return axiosClient.get(`${HTML_CONTENT_PATH}`, { params });
	},

	async getById(id) {
		return axiosClient.get(`${HTML_CONTENT_PATH}/${id}`);
	},

	async getConfigs() {
		return axiosClient.get(`${HTML_CONTENT_PATH}/configs`);
	},

	async createOne(body) {
		return axiosClient.post(`${HTML_CONTENT_PATH}`, body);
	},

	async updateOneById(id, body) {
		return axiosClient.patch(`${HTML_CONTENT_PATH}/${id}`, body);
	},
};
