import { formatISODate } from 'admin/utilities';
import { axiosClient } from './axiosClient';
import { BOOKING_PATH } from './constant';

export const bookingApi = {
	queryByParameters(params) {
		const { startDate, endDate, ...restParams } = params;
		if (startDate) {
			restParams.startDate = formatISODate(startDate);
		}
		if (endDate) {
			restParams.endDate = formatISODate(endDate);
		}

		return axiosClient.get(`${BOOKING_PATH}/query`, { params: restParams });
	},

	deleteOne(bookingId) {
		return axiosClient.delete(`${BOOKING_PATH}/${bookingId}`);
	},

	updateOne(id, updateBody) {
		const { dateOfBirth, appointmentDate, ...body } = updateBody;
		if (dateOfBirth) {
			body.dateOfBirth = formatISODate(dateOfBirth);
		}
		if (appointmentDate) {
			body.appointmentDate = formatISODate(appointmentDate);
		}

		return axiosClient.patch(`${BOOKING_PATH}/${id}`, body);
	},
};
