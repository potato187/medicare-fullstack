import { axiosClient } from './axiosClient';
import { SPECIALTIES_PATH } from './constant';

export const specialtiesApi = {
	queryByParams(params) {
		return axiosClient.get(`${SPECIALTIES_PATH}/get`, { params });
	},
};
