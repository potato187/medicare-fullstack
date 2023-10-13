import { axiosClient } from './axiosClient';
import { LANGUAGES_ENDPOINT } from './constant';

export const languageApi = {
	getLanguageById(languageId) {
		return axiosClient.get(`${LANGUAGES_ENDPOINT}/${languageId}`);
	},

	getLanguages() {
		return axiosClient.get(`${LANGUAGES_ENDPOINT}`);
	},

	updateLanguageById({ languageId, body }) {
		return axiosClient.put(`${LANGUAGES_ENDPOINT}/${languageId}`, body);
	},
};
