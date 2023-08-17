import { createFormData } from '@/admin/utilities';
import { axiosClient } from './axiosClient';
import { HTML_CONTENT_PATH } from './constant';
import { typeOf } from '@/utils';

export const htmlContentApi = {
	getByParams(params) {
		return axiosClient.get(HTML_CONTENT_PATH, { params });
	},
	getById(id) {
		return axiosClient.get(`${HTML_CONTENT_PATH}/${id}`);
	},
	createOrUpdate(htmlContent) {
		if (!htmlContent.id) {
			delete htmlContent.id;
		}
		const formData = createFormData(htmlContent);

		if (htmlContent.image && typeOf(htmlContent.image) === 'filelist') {
			formData.append('image', htmlContent.image[0]);
		}

		return axiosClient({
			method: htmlContent.id ? 'put' : 'post',
			url: HTML_CONTENT_PATH,
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	},
};
