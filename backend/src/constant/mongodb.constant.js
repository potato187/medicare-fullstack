const BOOKING_STATUS = ['pending', 'confirmed', 'completed', 'cancelled'];
const GENDERS = ['GF', 'GM', 'GO'];
const GENDER_DEFAULT = 'GF';
const MONGODB_EXCLUDE_FIELDS = ['__v', 'createdAt', 'updatedAt'];
const POSITIONS = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06'];
const ROLES = ['admin', 'mod'];
const STATUS = ['active', 'inactive'];
const SORT_DIRECTIONS = ['asc', 'desc'];

const LINK_TYPES = ['header', 'footer'];const PAGES = ['all', 'home', 'blog', 'blog_category', 'contact'];
const PAGE_POSITIONS = ['all', 'header', 'main', 'footer', 'top', 'left', 'bottom', 'right'];

module.exports = {
	BOOKING_STATUS,
	GENDERS,
	GENDER_DEFAULT,
	MONGODB_EXCLUDE_FIELDS,
	POSITIONS,
	ROLES,
	STATUS,
	SORT_DIRECTIONS,
	PAGES,
	PAGE_POSITIONS,
	LINK_TYPES,
};
