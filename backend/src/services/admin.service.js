const { UtilsRepo, KeyTokenRepo } = require('@/models/repository');
const { ADMIN_MODEL } = require('@/models/repository/constant');
const { createSearchData, convertToObjectIdMongodb } = require('@/utils');

const SEARCHABLE_FIELDS = ['firstName', 'lastName', 'email', 'phone'];

class AdminService {
	static model = ADMIN_MODEL;

	static async getByQueryParams(queryParams) {
		const { search, ...params } = queryParams;
		const match = { isActive: 'active', isDeleted: false };

		if (search) {
			match.$or = createSearchData(SEARCHABLE_FIELDS, search);
		}

		return UtilsRepo.getByQueryParams({
			model: AdminService.model,
			queryParams: { match, ...params },
		});
	}

	static async getOneById({ id, select }) {
		return UtilsRepo.findOne({
			model: AdminService.model,
			filter: { _id: convertToObjectIdMongodb(id) },
			select,
		});
	}

	static async updateOneById({ id, updateBody }) {
		const select = Object.keys(updateBody);

		if (!select.length) {
			return {};
		}

		const updatedAdmin = await UtilsRepo.findOneAndUpdate({
			model: AdminService.model,
			filter: { _id: convertToObjectIdMongodb(id) },
			updateBody,
			select,
		});

		return updatedAdmin;
	}

	static async deleteOneById(id) {
		const result = await AdminService.updateOneById({ id, updateBody: { isDeleted: true, isActive: 'inactive' } });
		if (result.isDeleted) {
			const store = await KeyTokenRepo.findOne({ userId: convertToObjectIdMongodb(id) }, ['_id']);
			if (store?._id) {
				await KeyTokenRepo.removeById(store._id);
			}
		}
		return {
			idDeletion: id,
		};
	}
}

module.exports = AdminService;
