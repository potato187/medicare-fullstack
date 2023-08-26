import { specialtiesApi } from 'admin/api';
import { Container } from 'admin/components';
import { useAsyncLocation, useCurrentIndex, useToggle } from 'admin/hooks';
import { compose } from 'admin/utilities';
import { useAuth } from 'hooks';
import { useIntl } from 'react-intl';

export function SpecialtyManager() {
	const { languageId } = useAuth();
	const { currentIndexRef: doctorIndexRef, setCurrentIndex: updateDoctorIndex } = useCurrentIndex();
	const intl = useIntl();

	const {
		data: Specialties,
		setData: setSpecialties,
		queryParams,
		totalPages,
		handleOnChangeSort,
		handleOnChangeSearch,
		handleOnPageChange,
		handleOnSelect,
	} = useAsyncLocation({
		getData: specialtiesApi.queryAdminByParams,
	});

	const [statusProfileModal, toggleProfileModal] = useToggle();
	const [statusCreateDoctorModal, toggleCreateDoctorModal] = useToggle();
	const [statusConfirmDeletionModal, toggleConfirmDeletionModal] = useToggle();
	const [statusExportModal, toggleExportModal] = useToggle();
	const [statusImportModal, toggleImportModal] = useToggle();

	const handleOpenProfileModal = compose(updateDoctorIndex, toggleProfileModal);

	const handleOpenConfirmDeletionModal = compose(updateDoctorIndex, toggleConfirmDeletionModal);

	return (
		<Container id='page-main'>
			<h1>hello world</h1>
		</Container>
	);
}
