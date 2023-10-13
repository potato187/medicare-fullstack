import { HEADERS_CONTENT } from 'constant';
import { buildFormData } from 'utils';
import { axiosClient } from './axiosClient';
import { SETTING_CONFIGS_ENDPOINT } from './constant';

export const settingConfigApi = {
	async getConfig() {
		return axiosClient.get(`${SETTING_CONFIGS_ENDPOINT}`);
	},

	async updateConfig(body) {
		const formData = new FormData();
		buildFormData(formData, body);

		return axiosClient.post(`${SETTING_CONFIGS_ENDPOINT}`, formData, {
			headers: HEADERS_CONTENT.formData,
		});
	},
};
