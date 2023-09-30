const { BadRequestError } = require('@/core');
const multer = require('multer');

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const storage = multer.diskStorage({
	destination: function destination(request, file, cb) {
		cb(null, 'public/uploads/temp');
	},
	filename: function filename(req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({
	storage,
	fileFilter: (request, file, cb) => {
		if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
			cb(new BadRequestError());
		}
		cb(null, true);
	},
});

module.exports = {
	upload,
};
