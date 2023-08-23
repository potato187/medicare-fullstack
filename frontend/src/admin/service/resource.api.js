import { axiosClient } from './axios/axiosClient';
import { RESOURCE_PATH } from './constant';

export const resourceApi = {
	async getAllGender() {
		return await axiosClient.get(`${RESOURCE_PATH}/gender`);
	},

	async getAllAdminRole() {
		return await axiosClient.get(`${RESOURCE_PATH}/admin-role`);
	},
};
