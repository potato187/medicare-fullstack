import { axiosClient } from './axiosClient';
import { LANGUAGES_PATH } from './constant';

export const languageApi = {
	getLanguageById(languageId) {
		return axiosClient.get(`${LANGUAGES_PATH}/${languageId}`);
	},

	getLanguages() {
		return axiosClient.get(`${LANGUAGES_PATH}`);
	},

	updateLanguageById({ languageId, data }) {
		return axiosClient.put(`${LANGUAGES_PATH}/${languageId}`, { data });
	},
};
