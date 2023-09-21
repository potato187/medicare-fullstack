import { axiosClient } from './axiosClient';
import { HTML_CONTENT_PATH } from './constant';

export const htmlContentApi = {
	async getByQueryParams(params) {
		return axiosClient.get(`${HTML_CONTENT_PATH}`, { params });
	},

	async getConfigs() {
		return axiosClient.get(`${HTML_CONTENT_PATH}/configs`);
	},
};
