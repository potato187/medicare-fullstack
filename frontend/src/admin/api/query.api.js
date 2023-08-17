import { axiosClient } from './axiosClient';
import { QUERY_PATH } from './constant';

export const queryApi = {
	getAll(params) {
		return axiosClient.get(`${QUERY_PATH}/get`, { params });
	},
};
