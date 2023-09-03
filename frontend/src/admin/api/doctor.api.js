import { axiosClient } from './axiosClient';
import { DOCTOR_PATH } from './constant';

export const doctorApi = {
	async queryByParameters(params) {
		if (!params.specialtyId) return { metadata: { data: [], meta: { totalPages: 1 } } };
		return await axiosClient.get(`${DOCTOR_PATH}/query`, { params });
	},

	async getOne({ id, params }) {
		return await axiosClient.get(`${DOCTOR_PATH}/${id}`, { params });
	},

	async updateOne({ id, updateBody }) {
		return await axiosClient.patch(`${DOCTOR_PATH}/${id}`, { ...updateBody });
	},

	async createOne(body) {
		return await axiosClient.post(`${DOCTOR_PATH}`, body);
	},

	async deleteOne(id) {
		return await axiosClient.delete(`${DOCTOR_PATH}/${id}`);
	},

	async export(body) {
		return await axiosClient.post(`${DOCTOR_PATH}/export`, body, {
			responseType: 'blob',
		});
	},

	async import(doctors) {
		return await axiosClient.post(`${DOCTOR_PATH}/import`, { doctors });
	},
};
