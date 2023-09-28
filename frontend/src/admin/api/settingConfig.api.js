import { axiosClient } from './axiosClient';
import { SETTING_CONFIGS_ENDPOINT } from './constant';

export const settingConfigApi = {
	async getConfig() {
		return axiosClient.get(`${SETTING_CONFIGS_ENDPOINT}`);
	},

	async updateConfig(body) {
		return axiosClient.patch(`${SETTING_CONFIGS_ENDPOINT}`, body);
	},
};
