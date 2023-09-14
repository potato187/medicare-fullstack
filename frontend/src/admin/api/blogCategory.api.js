import { axiosClient } from './axiosClient';
import { POST_CATEGORIES_PATH } from './constant';

export const blogCategoryApi = {
	getAll() {
		return axiosClient.get(`${POST_CATEGORIES_PATH}`);
	},

	getFlattenAll() {
		return axiosClient.get(`${POST_CATEGORIES_PATH}/flatten-blog-categories`);
	},

	createOne(body) {
		return axiosClient.post(`${POST_CATEGORIES_PATH}`, body);
	},

	sortable(body) {
		return axiosClient.post(`${POST_CATEGORIES_PATH}/sortable`, body);
	},

	deleteByIds(body) {
		return axiosClient.post(`${POST_CATEGORIES_PATH}/delete`, body);
	},

	updateOneById(id, body) {
		return axiosClient.patch(`${POST_CATEGORIES_PATH}/${id}`, body);
	},
};
