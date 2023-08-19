'use strict';
const { _AdminModel } = require('@/models');
const { UtilsRepo, AdminRepo } = require('@/models/repository');
const { createSelectData, createSortData, createSearchData, getInfoData } = require('@/utils');

class AdminService {
	static async query({ key_search = '', select = ['_id'], sort = { updateAt: 'asc' }, page = 1, pagesize = 25 }) {
		let filter = { isActive: 'active', isDeleted: false };
		const validPage = Math.max(1, page);
		const validPageSize = pagesize > 0 && pagesize < 100 ? pagesize : 25;
		const skip = (validPage - 1) * validPageSize;
		let _sort = createSortData(sort);

		if (key_search.length) {
			filter.$or = createSearchData(['firstName', 'lastName', 'email', 'phone'], key_search);
		}

		const documents = await _AdminModel
			.find(filter)
			.sort(_sort)
			.skip(skip)
			.limit(validPageSize)
			.select(createSelectData(select))
			.lean()
			.exec();

		return {
			data: documents,
			meta: {
				page: validPage,
				pagesize: validPage,
				keywords: key_search,
			},
		};
	}

	static async getTotalPages() {
		const totalPages = await UtilsRepo.getTotalPages(_AdminModel);
		return { totalPages };
	}

	static async updateAdminById(body) {
		const { id, updateBody } = body;

		const updatedAdmin = await AdminRepo.updateAdminById(id, updateBody);

		return {
			admin: getInfoData({ fields: ['_id', 'firstName', 'lastName', 'email', 'phone', 'role'], object: updatedAdmin }),
		};
	}

	static async deleteAdminById(id) {
		await AdminRepo.updateAdminById(id, { isDeleted: true });
		return { deletedAdminId: id };
	}
}

module.exports = AdminService;
