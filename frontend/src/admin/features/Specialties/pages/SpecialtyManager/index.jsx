/* eslint-disable */
import { specialtiesApi } from 'admin/api';
import { Container } from 'admin/components';
import { useAsyncLocation, useCurrentIndex, useFetchSpecialties, useFetchSpecialty } from 'admin/hooks';
import { useAuth } from 'hooks';

export function SpecialtyManager() {
	/* 	const { languageId } = useAuth();
	const { currentIndexRef: doctorIndexRef, setCurrentIndex: updateDoctorIndex } = useCurrentIndex();
 */

	const Specialties = useFetchSpecialties();

	console.log(Specialties);

	/* 	const [statusProfileModal, toggleProfileModal] = useToggle();
	const [statusCreateDoctorModal, toggleCreateDoctorModal] = useToggle();
	const [statusConfirmDeletionModal, toggleConfirmDeletionModal] = useToggle();
	const [statusExportModal, toggleExportModal] = useToggle();
	const [statusImportModal, toggleImportModal] = useToggle();

	const handleOpenProfileModal = compose(updateDoctorIndex, toggleProfileModal);

	const handleOpenConfirmDeletionModal = compose(updateDoctorIndex, toggleConfirmDeletionModal); */

	return (
		<Container id='page-main'>
			<h1>hello world</h1>
		</Container>
	);
}
