import { axiosClient } from './axiosClient';
import { DOCTOR_PATH } from './constant';

export const doctorApi = {
	getAll(params) {
		return axiosClient.get(`${DOCTOR_PATH}/get`, { params });
	},

	getDoctorDescription(doctorId) {
		return axiosClient.post(`${DOCTOR_PATH}/description`, { doctorId });
	},

	createOne(data) {
		return axiosClient.post(`${DOCTOR_PATH}/create`, { data });
	},

	updateOne(data) {
		return axiosClient.put(`${DOCTOR_PATH}/update`, { data });
	},

	deleteOne(id) {
		return axiosClient.delete(`${DOCTOR_PATH}/delete/${id}`);
	},

	exportData(data) {
		return axiosClient.get(`${DOCTOR_PATH}/export`, {
			params: data,
			responseType: 'blob',
		});
	},

	importData(data, specialtyId) {
		return axiosClient.post(`${DOCTOR_PATH}/import/${specialtyId}`, { data });
	},
};
