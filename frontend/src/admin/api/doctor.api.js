import { axiosClient } from './axiosClient';
import { DOCTOR_PATH } from './constant';

export const doctorApi = {
	async queryByParameters(params) {
		if (!params.specialtyId) return { metadata: { data: [], meta: { totalPages: 1 } } };
		return axiosClient.get(`${DOCTOR_PATH}`, { params });
	},
};
