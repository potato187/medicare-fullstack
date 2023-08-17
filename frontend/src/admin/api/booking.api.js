import { axiosClient } from './axiosClient';
import { BOOKINGS_PATH } from './constant';

export const bookingApi = {
	getAll(params) {
		return axiosClient.get(`${BOOKINGS_PATH}`, { params });
	},

	updateOne(data) {
		return axiosClient.put(`${BOOKINGS_PATH}`, { data });
	},

	deleteOne(bookingId) {
		return axiosClient.delete(`${BOOKINGS_PATH}/delete/${bookingId}`);
	},
};
