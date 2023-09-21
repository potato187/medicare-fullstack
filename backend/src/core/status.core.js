const codeReason = {
	/*  Common codes 10xxxx */
	100400: {
		vi: 'Yêu cầu không hợp lệ.',
		en: 'Invalid request.',
	},
	102400: {
		vi: 'Yêu cầu không hợp lệ.',
		en: 'Invalid query params.',
	},
	100200: {
		vi: 'Ok!',
		en: 'Ok!',
	},
	100201: {
		vi: 'Created!',
		en: 'Created!',
	},
	101400: {
		vi: '',
		en: 'Invalid Email',
	},
	107400: {
		vi: '',
		en: 'Invalid id',
	},
	100401: {
		vi: 'Không có quyền truy cập.',
		en: 'Unauthorized access.',
	},
	100403: {
		vi: 'Không có quyền truy cập.',
		en: 'Access denied.',
	},
	100404: {
		vi: 'Không tìm thấy trang.',
		en: 'Page not found.',
	},
	100409: {
		vi: 'Yêu cầu không hợp lệ.',
		en: 'Invalid request.',
	},
	100500: {
		vi: 'Lỗi nội bộ của máy chủ.',
		en: 'Internal server error.',
	},

	/* Auth  codes 10xxxx */
	101401: {
		vi: 'AccessToken invalid or required.',
		en: 'AccessToken invalid or required.',
	},
	102401: {
		vi: 'AccessToken hết hạn.',
		en: 'AccessToken expired.',
	},

	103401: {
		vi: 'RefreshToken đã hết hạn.',
		en: 'RefreshToken expired.',
	},
	104401: {
		vi: 'RefreshToken không hợp lệ.',
		en: 'Invalid RefreshToken.',
	},

	105401: {
		vi: '',
		en: 'Refresh token is invalid or has been used.',
	},

	/* Access service error codes 20xxxx */
	200200: {
		vi: '',
		en: 'Admin registered successfully',
	},
	200400: {
		vi: '',
		en: 'Admin already exists with the provided email or phone.',
	},
	201400: {
		vi: '',
		en: 'Invalid password or email.',
	},
	200404: {
		vi: '',
		en: 'Admin not found with the provided email.',
	},

	/* Admin service error codes 30xxxx */
	300200: {
		vi: '',
		en: 'Admin updated successfully',
	},
	301204: {
		vi: '',
		en: 'Admin deleted successfully',
	},

	/*  Specialty  error codes  40xxxx */
	400404: {
		vi: 'Chuyên ngành không tồn tại.',
		en: 'Specialty does not exist.',
	},
	400409: {
		vi: 'Chuyên ngành đã tồn tại.',
		en: 'Specialty already exists.',
	},

	/*  Doctor error codes 50xxxx */
	500404: {
		vi: 'Bác sĩ không tồn tại.',
		en: 'Doctor does not exist.',
	},
	500409: {
		vi: 'Bác sĩ đã tồn tại.',
		en: 'Doctor already exists.',
	},
};

module.exports = codeReason;
