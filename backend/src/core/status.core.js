const codeReason = {
	/* Common codes 10xxxx */
	100400: {
		en: 'Invalid request.',
		vi: 'Yêu cầu không hợp lệ.',
	},
	100200: {
		en: 'OK!',
		vi: 'Đã hoàn thành!',
	},
	100201: {
		en: 'Created!',
		vi: 'Đã tạo!',
	},
	101400: {
		en: 'Invalid Email',
		vi: 'Email không hợp lệ',
	},
	102400: {
		en: 'Invalid query parameters.',
		vi: 'Tham số truy vấn không hợp lệ.',
	},
	103400: {
		en: 'The requested password does not match the account password. Please try again.',
		vi: 'Mật khẩu yêu cầu và mật khẩu tài khoản không khớp. Vui lòng thử lại.',
	},
	107400: {
		en: 'Invalid ID',
		vi: 'ID không hợp lệ',
	},
	100401: {
		en: 'Unauthorized access.',
		vi: 'Không có quyền truy cập.',
	},
	100403: {
		en: 'Access denied.',
		vi: 'Truy cập bị từ chối.',
	},
	100404: {
		en: 'Page not found.',
		vi: 'Không tìm thấy trang.',
	},
	100409: {
		en: 'Invalid request.',
		vi: 'Yêu cầu không hợp lệ.',
	},
	100500: {
		en: 'Internal server error.',
		vi: 'Lỗi nội bộ của máy chủ.',
	},

	/* Auth codes 10xxxx */
	101401: {
		en: 'AccessToken is invalid or required.',
		vi: 'AccessToken không hợp lệ hoặc cần thiết.',
	},
	102401: {
		en: 'AccessToken has expired.',
		vi: 'AccessToken đã hết hạn.',
	},
	103401: {
		en: 'RefreshToken has expired.',
		vi: 'RefreshToken đã hết hạn.',
	},
	104401: {
		en: 'Invalid RefreshToken.',
		vi: 'RefreshToken không hợp lệ.',
	},
	105401: {
		en: 'Refresh token is invalid or has been used.',
		vi: 'Refresh token không hợp lệ hoặc đã được sử dụng.',
	},

	/* Access service error codes 20xxxx */
	200201: {
		en: 'Admin registered successfully',
		vi: 'Đã đăng ký Admin thành công',
	},
	201200: {
		en: 'Admin updated successfully',
		vi: 'Đã cập nhật Admin thành công',
	},
	202200: {
		en: 'Admin changed password successfully',
		vi: 'Đã thay đổi mật khẩu Admin thành công',
	},
	200400: {
		en: 'Admin already exists with the provided email or phone.',
		vi: 'Admin đã tồn tại với email hoặc số điện thoại đã cung cấp.',
	},
	201400: {
		en: 'Invalid password or email.',
		vi: 'Mật khẩu hoặc email không hợp lệ.',
	},
	200404: {
		en: 'Admin not found with the provided email.',
		vi: 'Không tìm thấy Admin với email đã cung cấp.',
	},
	201409: {
		en: 'The provided email or phone number is already associated with another profile. Please use a unique email or phone number.',
		vi: 'Email hoặc số điện thoại đã được sử dụng bởi một tài khoản khác. Vui lòng sử dụng một email hoặc số điện thoại duy nhất.',
	},

	/* Admin service codes 30xxxx */
	300200: {
		en: 'Admin updated successfully',
		vi: 'Đã cập nhật Admin thành công',
	},
	301200: {
		en: 'Admin deleted successfully',
		vi: 'Đã xóa Admin thành công',
	},

	/* Specialty and Doctor codes 40xxxx */
	400200: {
		en: 'Doctor updated successfully.',
		vi: 'Đã cập nhật Bác sĩ thành công.',
	},
	402200: {
		en: 'Specialty updated successfully.',
		vi: 'Đã cập nhật Chuyên ngành thành công.',
	},
	403200: {
		en: 'Doctor deleted successfully.',
		vi: 'Đã xóa Bác sĩ thành công.',
	},
	404200: {
		en: 'Specialty deleted successfully.',
		vi: 'Đã xóa Chuyên ngành thành công.',
	},
	400201: {
		en: 'Doctor created successfully.',
		vi: 'Đã tạo Bác sĩ thành công.',
	},
	401201: {
		en: 'The list of Doctors imported successfully from the file.',
		vi: 'Danh sách Bác sĩ đã được nhập thành công từ tệp.',
	},
	402201: {
		en: 'Specialty created successfully.',
		vi: 'Đã tạo Chuyên ngành thành công.',
	},
	400404: {
		en: 'Doctor does not exist.',
		vi: 'Bác sĩ không tồn tại.',
	},
	401404: {
		en: 'Specialty does not exist.',
		vi: 'Chuyên ngành không tồn tại.',
	},
	400409: {
		en: 'Doctor already exists.',
		vi: 'Bác sĩ đã tồn tại.',
	},
	401409: {
		en: 'Specialty already exists.',
		vi: 'Chuyên ngành đã tồn tại.',
	},

	/* Blog and Blog Categories codes 50xxxx */
	501200: {
		en: 'Blog updated successfully.',
		vi: 'Đã cập nhật Blog thành công.',
	},
	502200: {
		en: 'Blog category updated successfully.',
		vi: 'Đã cập nhật Danh mục Blog thành công.',
	},
	503200: {
		en: 'Blog category sortable successfully.',
		vi: 'Đã sắp xếp thành công Danh mục Blog.',
	},
	504200: {
		en: 'Blog category deleted successfully',
		vi: 'Đã xóa Danh mục Blog thành công',
	},
	505200: {
		en: 'Blog deleted successfully',
		vi: 'Đã xóa Blog thành công',
	},
	506200: {
		en: 'News module updated successfully.',
		vi: 'Đã cập nhật Mô-đun Tin tức thành công',
	},
	507200: {
		en: 'News module deleted successfully.',
		vi: 'Đã xóa Mô-đun Tin tức thành công',
	},
	500201: {
		en: 'Blog created successfully.',
		vi: 'Đã tạo Blog thành công',
	},
	501201: {
		en: 'Blog category created successfully.',
		vi: 'Đã tạo Danh mục Blog thành công',
	},
	503201: {
		en: 'News module created successfully.',
		vi: 'Đã tạo Mô-đun Tin tức thành công',
	},

	/* Booking code 60xxxx */
	600200: {
		en: 'Booking updated successfully.',
		vi: 'Đã cập nhật Đặt lịch thành công',
	},
	601200: {
		en: 'Booking deleted successfully.',
		vi: 'Đã xóa Đặt lịch thành công',
	},
	600201: {
		en: 'Booking updated successfully.',
		vi: 'Đã cập nhật Đặt lịch thành công',
	},

	/* Others code 70xxxx */
	700200: {
		en: 'HTML content updated successfully.',
		vi: 'Đã cập nhật Nội dung HTML thành công',
	},
	701200: {
		en: 'Link updated successfully.',
		vi: 'Đã cập nhật Liên kết thành công',
	},
	702200: {
		en: 'Language updated successfully.',
		vi: 'Đã cập nhật Ngôn ngữ thành công',
	},
	703200: {
		en: 'Configs updated successfully.',
		vi: 'Đã cập nhật Cấu hình thành công',
	},
	704200: {
		en: 'HTML content deleted successfully.',
		vi: 'Đã xóa Nội dung HTML thành công',
	},
	705200: {
		en: 'Link deleted successfully.',
		vi: 'Đã xóa Liên kết thành công',
	},
	706200: {
		en: 'Links sorted successfully.',
		vi: 'Liên kết đã được sắp xếp thành công.',
	},
	700201: {
		en: 'HTML content created successfully.',
		vi: 'Đã tạo Nội dung HTML thành công',
	},
	701201: {
		en: 'Link created successfully.',
		vi: 'Đã tạo Liên kết thành công',
	},
	702404: {
		en: 'HTML content is deleted or does not exist.',
		vi: 'Nội dung HTML đã bị xóa hoặc không tồn tại.',
	},
};

module.exports = codeReason;
