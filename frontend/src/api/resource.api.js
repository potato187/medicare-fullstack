import { axiosClient } from './axiosClient';
import { RESOURCE_ENDPOINT } from './constant';

export const resourceApi = {
	getAll({ model, params = {} }) {
		return axiosClient.get(`${RESOURCE_ENDPOINT}/${model}`, { params });
	},
};
