export const IMPORT_STATUS = {
	PREPARE: 'prepare',
	SUCCESS: 'success',
	FAIL: 'fail',
};

export const BOOKING_STATUS = [
	{
		value: 'pending',
		label: {
			en: 'Pending',
			vi: 'Chờ xác nhận',
		},
	},
	{
		value: 'confirmed',
		label: {
			en: 'Confirmed',
			vi: 'Đã xác nhận',
		},
	},
	{
		value: 'completed',
		label: {
			en: 'Completed',
			vi: 'Hoàn thành',
		},
	},
	{
		value: 'cancelled',
		label: {
			en: 'Cancelled',
			vi: 'Hủy bỏ',
		},
	},
];
