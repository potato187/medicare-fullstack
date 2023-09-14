const AccessController = require('./access.controller');
const AdminController = require('./admin.controller');
const DoctorController = require('./doctor.controller');
const LanguageController = require('./language.controller');
const ResourceController = require('./resource.controller');
const SpecialtyController = require('./specialty.controller');
const BookingController = require('./booking.controller');
const BlogCategoryController = require('./blogCategory.controller');
const blogController = require('./blog.controller');

module.exports = {
	AccessController,
	AdminController,
	DoctorController,
	LanguageController,
	ResourceController,
	SpecialtyController,
	BookingController,
	BlogCategoryController,
	blogController,
};
