import { axiosClient } from './axiosClient';
import { LANGUAGES_PATH } from './constant';

export const languageApi = {
	getLanguageById(languageId) {
		return axiosClient.get(`${LANGUAGES_PATH}/get/${languageId}`);
	},

	getLanguages() {
		return axiosClient.get(`${LANGUAGES_PATH}/get`);
	},

	updateLanguageById({ languageId, data }) {
		return axiosClient.put(`${LANGUAGES_PATH}/get/${languageId}`, { data });
	},
};
