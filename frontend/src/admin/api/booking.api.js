import { axiosClient } from './axiosClient';
import { BOOKING_PATH } from './constant';

export const bookingApi = {
	getByParams(params) {
		return axiosClient.get(`${BOOKING_PATH}/query`, { params });
	},

	/* 	updateOne(data) {
		return axiosClient.put(`${BOOKING_PATH}`, { data });
	},

	deleteOne(bookingId) {
		return axiosClient.delete(`${BOOKING_PATH}/delete/${bookingId}`);
	}, */
};
