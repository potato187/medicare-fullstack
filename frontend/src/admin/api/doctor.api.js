import { axiosClient } from './axiosClient';
import { DOCTOR_PATH } from './constant';

export const doctorApi = {
	async queryByParameters(params) {
		if (!params.specialtyId) return { metadata: { data: [], meta: { totalPages: 1 } } };
		return await axiosClient.get(`${DOCTOR_PATH}`, { params });
	},

	async getOne({ id, params }) {
		return await axiosClient.get(`${DOCTOR_PATH}/${id}`, { params });
	},

	async updateOne({ id, updateBody }) {
		return await axiosClient.put(`${DOCTOR_PATH}/${id}`, { updateBody });
	},
};
