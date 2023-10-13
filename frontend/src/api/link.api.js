import { axiosClient } from './axiosClient';
import { LINK_ENDPOINT } from './constant';

export const linkApi = {
	createOne(body) {
		return axiosClient.post(LINK_ENDPOINT, body);
	},

	getAll(params) {
		return axiosClient.get(LINK_ENDPOINT, { params });
	},

	getOneById(id) {
		return axiosClient.get(`${LINK_ENDPOINT}/${id}`);
	},

	updateOneById(id, body) {
		return axiosClient.patch(`${LINK_ENDPOINT}/${id}`, body);
	},

	sortable(body) {
		return axiosClient.patch(`${LINK_ENDPOINT}/sortable`, body);
	},

	deleteByIds(body) {
		return axiosClient.post(`${LINK_ENDPOINT}/delete`, body);
	},
};
