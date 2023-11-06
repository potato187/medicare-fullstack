const { UtilsRepo, KeyTokenRepo } = require('@/models/repository');
const { ADMIN_MODEL } = require('@/models/repository/constant');
const { createSearchData, convertToObjectIdMongodb } = require('@/utils');

const SEARCHABLE_FIELDS = ['firstName', 'lastName', 'email', 'phone'];

class AdminService {
	static model = ADMIN_MODEL;

	static async getByQueryParams(req) {
		const { query: queryParams, user } = req;

		const { search, ...params } = queryParams;
		const match = { isActive: 'active', isDeleted: false, _id: { $ne: convertToObjectIdMongodb(user.userId) } };

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

		const _id = convertToObjectIdMongodb(id);
		const { model } = AdminService;

		if (updateBody?.email || updateBody?.phone) {
			const { email, phone } = updateBody;
			const filter = {
				$and: [
					{
						_id: { $ne: _id },
					},
					{
						$or: [],
					},
				],
			};
			if (email) filter.$and[1].$or.push({ email });
			if (phone) filter.$and[1].$or.push({ phone });

			await UtilsRepo.checkConflictedWithObjectId({
				model,
				filter,
				objectId: _id,
				code: 201409,
			});
		}

		const updatedAdmin = await UtilsRepo.findOneAndUpdate({
			model,
			filter: { _id },
			updateBody,
			select,
		});

		if (updatedAdmin.email) {
			await KeyTokenRepo.removeByUserId(id);
		}

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
