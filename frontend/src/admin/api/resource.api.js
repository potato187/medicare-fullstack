import { axiosClient } from './axiosClient';
import { RESOURCE_PATH } from './constant';

export const resourceApi = {
	async getAll(model, params) {
		return await axiosClient.get(`${RESOURCE_PATH}/${model}`, { params });
	},
};
