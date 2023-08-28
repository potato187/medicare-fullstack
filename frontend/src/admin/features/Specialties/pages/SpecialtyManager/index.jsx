/* eslint-disable */
import { specialtiesApi } from 'admin/api';
import { Button, Container, Dropdown, DropdownIntl, UnFieldDebounce } from 'admin/components';
import { useAsyncLocation, useCurrentIndex, useFetchSpecialties, useFetchSpecialty, useToggle } from 'admin/hooks';
import { useAuth } from 'hooks';
import { MdAdd, MdImportExport } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

export function SpecialtyManager() {
	/* 	const { languageId } = useAuth();
	const { currentIndexRef: doctorIndexRef, setCurrentIndex: updateDoctorIndex } = useCurrentIndex();
 */

	const Specialties = useFetchSpecialties();

	const [statusCreateDoctorModal, toggleCreateDoctorModal] = useToggle();
	const [statusConfirmDeletionModal, toggleConfirmDeletionModal] = useToggle();
	const [statusExportModal, toggleExportModal] = useToggle();
	const [statusImportModal, toggleImportModal] = useToggle();

	/* 	const [statusProfileModal, toggleProfileModal] = useToggle();


	const handleOpenProfileModal = compose(updateDoctorIndex, toggleProfileModal);

	const handleOpenConfirmDeletionModal = compose(updateDoctorIndex, toggleConfirmDeletionModal); */

	return (
		<Container id='page-main'>
			<div className='d-flex flex-column h-100 py-5'>
				<div className='d-flex pb-4'>
					<div className='d-flex items-end gap-2'>
						<Dropdown showCounter size='md' name='specialtyId' value='sp_01' options={Specialties} />
						<div className='d-flex'>
							<UnFieldDebounce
								delay={500}
								initialValue=''
								type='text'
								placeholderIntl='form.search_placeholder'
								ariallabel='search field'
								id='search-field'
							/>
						</div>
					</div>
					<div className='px-5 d-flex gap-2 ms-auto'>
						<Button size='sm' onClick={toggleCreateDoctorModal}>
							<span>
								<FormattedMessage id='button.create_doctor' />
							</span>
							<MdAdd size='1.25em' className='ms-2' />
						</Button>
						<Button size='sm' onClick={toggleExportModal}>
							<span>
								<FormattedMessage id='button.export_doctors' />
							</span>
							<MdImportExport size='1.25em' className='ms-2' />
						</Button>
						<Button size='sm' onClick={toggleImportModal}>
							<span>
								<FormattedMessage id='button.import_doctors' />
							</span>
							<MdImportExport size='1.25em' className='ms-2' />
						</Button>
					</div>
				</div>
			</div>
		</Container>
	);
}
