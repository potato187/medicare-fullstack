import { axiosClient } from './axiosClient';
import { DOCTOR_ENDPOINT } from './constant';

export const doctorApi = {
	async queryByParameters(params) {
		if (!params.specialtyId) return { metadata: { data: [], meta: { totalPages: 1 } } };
		return axiosClient.get(`${DOCTOR_ENDPOINT}/query`, { params });
	},

	async getOne({ id, params }) {
		return axiosClient.get(`${DOCTOR_ENDPOINT}/${id}`, { params });
	},

	async updateOne({ id, updateBody }) {
		return axiosClient.patch(`${DOCTOR_ENDPOINT}/${id}`, { ...updateBody });
	},

	async createOne(body) {
		return axiosClient.post(`${DOCTOR_ENDPOINT}`, body);
	},

	async deleteOne(id) {
		return axiosClient.delete(`${DOCTOR_ENDPOINT}/${id}`);
	},

	async export(body) {
		return axiosClient.post(`${DOCTOR_ENDPOINT}/export`, body, {
			responseType: 'blob',
		});
	},

	async import(doctors) {
		return await axiosClient.post(`${DOCTOR_ENDPOINT}/import`, { doctors });
	},
};
