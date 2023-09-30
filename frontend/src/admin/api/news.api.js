import { axiosClient } from './axiosClient';
import { NEWS_ENDPOINT } from './constant';

export const newsApi = {
	async createOne(body) {
		return axiosClient.post(`${NEWS_ENDPOINT}`, body);
	},

	async getConfig() {
		return axiosClient.get(`${NEWS_ENDPOINT}/config`);
	},

	async getOneById(id) {
		return axiosClient.get(`${NEWS_ENDPOINT}/get/${id}`);
	},

	async getByQueryParams(params) {
		return axiosClient.get(`${NEWS_ENDPOINT}/query`, { params });
	},

	async deleteOneById(id) {
		return axiosClient.delete(`${NEWS_ENDPOINT}/${id}`);
	},

	async updateOneById(id, body) {
		return axiosClient.patch(`${NEWS_ENDPOINT}/${id}`, body);
	},
};
