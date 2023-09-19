import { axiosClient } from './axiosClient';
import { LANGUAGES_PATH } from './constant';

export const languageApi = {
	async getLanguageById(languageId) {
		return axiosClient.get(`${LANGUAGES_PATH}/${languageId}`);
	},

	async getLanguages() {
		return axiosClient.get(`${LANGUAGES_PATH}`);
	},

	async updateLanguageById({ languageId, body }) {
		return axiosClient.put(`${LANGUAGES_PATH}/${languageId}`, body);
	},
};
