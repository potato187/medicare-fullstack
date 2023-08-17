import { typeOf } from '@/utils';
import { createFormData } from '@/admin/utilities';
import { axiosClient } from './axiosClient';
import { POST_PATH } from './constant';

export const postApi = {
	getByParams(params) {
		return axiosClient.get(`${POST_PATH}/get`, { params });
	},
	getById(id) {
		return axiosClient.get(`${POST_PATH}/${id}`);
	},
	createOrUpdateOne(data) {
		const { categoryIds, postData } = data;
		const apiMethod = postData.id ? 'put' : 'post';
		if (!postData.id) {
			delete postData.id;
		}

		const formData = createFormData(postData);

		if (postData.thumbnail && typeOf(postData.thumbnail) === 'filelist') {
			formData.append('thumbnail', postData.thumbnail[0]);
		}

		categoryIds.forEach((id) => {
			formData.append('categoryIds[]', id);
		});

		return axiosClient({
			method: apiMethod,
			url: POST_PATH,
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	},

	deleteOne(postId) {
		return axiosClient.delete(`${POST_PATH}/${postId}`);
	},
	toggleDisplayPost(postId) {
		return axiosClient.put(`${POST_PATH}/display/${postId}`);
	},
};
