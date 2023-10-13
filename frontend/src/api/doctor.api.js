import { axiosClient } from './axiosClient';
import { DOCTOR_ENDPOINT } from './constant';

export const doctorApi = {
	queryByParameters(params) {
		if (!params.specialtyId) return { metadata: { data: [], meta: { totalPages: 1 } } };
		return axiosClient.get(`${DOCTOR_ENDPOINT}/query`, { params });
	},

	getOne({ id, params }) {
		return axiosClient.get(`${DOCTOR_ENDPOINT}/${id}`, { params });
	},

	updateOne({ id, updateBody }) {
		return axiosClient.patch(`${DOCTOR_ENDPOINT}/${id}`, { ...updateBody });
	},

	createOne(body) {
		return axiosClient.post(`${DOCTOR_ENDPOINT}`, body);
	},

	deleteOne(id) {
		return axiosClient.delete(`${DOCTOR_ENDPOINT}/${id}`);
	},

	export(body) {
		return axiosClient.post(`${DOCTOR_ENDPOINT}/export`, body, {
			responseType: 'blob',
		});
	},

	import(doctors) {
		return axiosClient.post(`${DOCTOR_ENDPOINT}/import`, { doctors });
	},
};
