import { axiosClient } from './axiosClient';
import { NEWS_ENDPOINT } from './constant';

export const newsApi = {
	createOne(body) {
		return axiosClient.post(`${NEWS_ENDPOINT}`, body);
	},

	getConfig() {
		return axiosClient.get(`${NEWS_ENDPOINT}/config`);
	},

	getOneById(id) {
		return axiosClient.get(`${NEWS_ENDPOINT}/get/${id}`);
	},

	getByQueryParams(params) {
		return axiosClient.get(`${NEWS_ENDPOINT}/query`, { params });
	},

	deleteOneById(id) {
		return axiosClient.delete(`${NEWS_ENDPOINT}/${id}`);
	},

	updateOneById(id, body) {
		return axiosClient.patch(`${NEWS_ENDPOINT}/${id}`, body);
	},
};
