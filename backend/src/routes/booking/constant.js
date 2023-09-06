const SortFields = ['fullName', 'dateOfBirth', 'gender', 'createdAt', 'updatedAt', 'isVerify'];
const SortDefaults = [['createdAt', 'desc']];

const SelectFields = [
	'_id',
	'fullName',
	'address',
	'phone',
	'dateOfBirth',
	'gender',
	'note',
	'status',
	'doctorId',
	'specialtyId',
	'isVerify',
];

const BookingStatusOptions = ['pending', 'confirmed', 'completed', 'cancelled'];
const BookingStatusDefault = 'pending';

module.exports = {
	SortFields,
	SortDefaults,
	SelectFields,
	BookingStatusOptions,
	BookingStatusDefault,
};
