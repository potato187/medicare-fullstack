import { axiosClient } from './axiosClient';
import { POST_CATEGORIES_ENDPOINT } from './constant';

export const blogCategoryApi = {
	getAll() {
		return axiosClient.get(`${POST_CATEGORIES_ENDPOINT}`);
	},

	getFlattenAll() {
		return axiosClient.get(`${POST_CATEGORIES_ENDPOINT}/flatten-blog-categories`);
	},

	createOne(body) {
		return axiosClient.post(`${POST_CATEGORIES_ENDPOINT}`, body);
	},

	sortable(body) {
		return axiosClient.post(`${POST_CATEGORIES_ENDPOINT}/sortable`, body);
	},

	deleteByIds(body) {
		return axiosClient.post(`${POST_CATEGORIES_ENDPOINT}/delete`, body);
	},

	updateOneById(id, body) {
		return axiosClient.patch(`${POST_CATEGORIES_ENDPOINT}/${id}`, body);
	},
};
