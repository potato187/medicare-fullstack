const SELECT_FIELDS = [
	'_id',
	'firstName',
	'lastName',
	'email',
	'phone',
	'description',
	'gender',
	'position',
	'address',
	'specialtyId',
];

const SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'firstName', 'lastName', 'email', 'position'];

const EXPORT_TYPES = ['all', 'selected', 'page'];

const PAGE_TYPE = 'page';

module.exports = {
	SELECT_FIELDS,
	EXPORT_TYPES,
	SORTABLE_FIELDS,
	PAGE_TYPE,
};
