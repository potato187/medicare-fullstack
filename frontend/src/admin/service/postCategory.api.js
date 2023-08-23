import { axiosClient } from './axios/axiosClient';
import { POST_CATEGORIES_PATH } from './constant';

export const postCategoryApi = {
	getAll() {
		return axiosClient.get(`${POST_CATEGORIES_PATH}/get`);
	},

	get() {
		return axiosClient.get(`${POST_CATEGORIES_PATH}/get-all`);
	},

	createOne(newCategory) {
		return axiosClient.post(`${POST_CATEGORIES_PATH}/create`, { ...newCategory });
	},

	updateOne(category) {
		return axiosClient.put(`${POST_CATEGORIES_PATH}/update`, { ...category });
	},

	deleteByIds(data) {
		return axiosClient.delete(`${POST_CATEGORIES_PATH}/delete`, { data });
	},

	sortCategories(flattenedCategories) {
		return axiosClient.put(`${POST_CATEGORIES_PATH}/sort`, { ...flattenedCategories });
	},
};
