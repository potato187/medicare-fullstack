import { axiosClient } from './axiosClient';
import { LANGUAGES_ENDPOINT } from './constant';

export const languageApi = {
	async getLanguageById(languageId) {
		return axiosClient.get(`${LANGUAGES_ENDPOINT}/${languageId}`);
	},

	async getLanguages() {
		return axiosClient.get(`${LANGUAGES_ENDPOINT}`);
	},

	async updateLanguageById({ languageId, body }) {
		return axiosClient.put(`${LANGUAGES_ENDPOINT}/${languageId}`, body);
	},
};
