import { axiosClient } from './axiosClient';
import { SPECIALTIES_PATH } from './constant';

export const specialtiesApi = {
	getAll(params) {
		return axiosClient.get(`${SPECIALTIES_PATH}/get`, { params });
	},
};
