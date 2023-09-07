import moment from 'moment';
import { axiosClient } from './axiosClient';
import { BOOKING_PATH } from './constant';

export const bookingApi = {
	queryByParameters(params) {
		if (params.startDate) {
			params.startDate = moment(params.startDate).toISOString();
		}

		if (params.endDate) {
			params.endDate = moment(params.endDate).toISOString();
		}
		return axiosClient.get(`${BOOKING_PATH}/query`, { params });
	},

	deleteOne(bookingId) {
		return axiosClient.delete(`${BOOKING_PATH}/${bookingId}`);
	},

	/* 	updateOne(data) {
		return axiosClient.put(`${BOOKING_PATH}`, { data });
	},

	, */
};
