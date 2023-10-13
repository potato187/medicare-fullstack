import { axiosClient } from './axiosClient';
import { SPECIALTIES_ENDPOINT } from './constant';

export const specialtiesApi = {
	queryByParams(params) {
		return axiosClient.get(`${SPECIALTIES_ENDPOINT}/get`, { params });
	},
};
