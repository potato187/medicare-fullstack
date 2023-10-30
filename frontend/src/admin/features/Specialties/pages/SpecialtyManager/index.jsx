import { doctorApi } from 'api';
import {
	Button,
	ConfirmModal,
	Container,
	ContainerGrid,
	Dropdown,
	FooterContainer,
	FormattedDescription,
	SortableTableHeader,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
	UnFieldCheckBox,
	UnFieldDebounce,
} from 'components';
import { useAuth, useIndex, useToggle } from 'hooks';
import produce from 'immer';
import { BiExport, BiImport } from 'react-icons/bi';
import { MdAdd } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { compose, downloadExcelFile, formatPhone, showToastMessage, tryCatchAndToast } from 'utils';
import { DoctorModal, ExportModal, ImportExcelModal } from '../../components';
import { useSpecialties } from '../../hooks';
import { getHandleExport } from '../../utils/export.strategy';

export default function SpecialtyManager() {
	const {
		info: { languageId },
	} = useAuth();
	const intl = useIntl();
	const { index: doctorIndex, setIndex: setDoctorIndex } = useIndex();

	const {
		Specialties,
		Positions,
		PositionLabels,
		Genders,
		Doctors,
		queryParams,
		isLoading,
		setDoctors,
		handleSelect,
		handleChangeSort,
		handleChangeSearch,
		handlePageChange,
		handleSelectSpecialty,
	} = useSpecialties(languageId);

	const [statusModal, toggleModal] = useToggle();
	const [statusConfirmModal, toggleConfirmModal] = useToggle();
	const [statusExportModal, toggleExportModal] = useToggle();
	const [statusImportModal, toggleImportModal] = useToggle();

	const handleToggleModal = compose(setDoctorIndex, toggleModal);
	const handleToggleConfirmModal = compose(setDoctorIndex, toggleConfirmModal);

	const handleOnUpdate = tryCatchAndToast(async ({ id, data }) => {
		if (Object.keys(data).length) {
			const { message, metadata } = await doctorApi.updateOne({ id, updateBody: data });
			if (Object.keys(metadata).length) {
				setDoctors(
					produce((draft) => {
						const { specialtyId, ...data } = metadata;
						if (specialtyId && specialtyId !== queryParams.specialtyId) {
							draft.splice(doctorIndex, 1);
						} else {
							Object.entries(data).forEach(([key, value]) => {
								if (Object.hasOwn(draft[doctorIndex], key)) {
									draft[doctorIndex][key] = value;
								}
							});
						}
					}),
				);
				showToastMessage(message, languageId);
			}
		}
		handleToggleModal(-1);
	}, languageId);

	const handleOnCreate = tryCatchAndToast(async (newDoctor) => {
		const { metadata, message } = await doctorApi.createOne(newDoctor);
		if (Doctors.length < +queryParams.pagesize) {
			setDoctors(
				produce((draft) => {
					delete newDoctor.description;
					draft.push(metadata);
				}),
			);
		}
		showToastMessage(message, languageId);
		handleToggleModal(-1);
	}, languageId);

	const handleOnSubmitDeletion = tryCatchAndToast(async () => {
		const doctor = Doctors[doctorIndex] || {};
		if (doctor?._id) {
			const { message } = await doctorApi.deleteOne(doctor._id);
			setDoctors(
				produce((draft) => {
					draft.splice(doctorIndex, 1);
				}),
			);
			showToastMessage(message, languageId);
		}
		toggleConfirmModal();
	}, languageId);

	const toggleSelect = (index) => {
		setDoctors(
			produce((draft) => {
				draft[index].isSelected = !draft[index].isSelected;
			}),
		);
	};

	const toggleSelectAll = (event) => {
		const { checked } = event.target;
		setDoctors(
			produce((draft) => {
				draft.forEach((item) => {
					item.isSelected = checked;
				});
			}),
		);
	};

	const handleOnExport = tryCatchAndToast(async (data) => {
		const { type } = data;
		const body = getHandleExport(type, { Doctors, queryParams });
		if (type === 'selected' && !body?.ids?.length) {
			toast.warning(
				intl.formatMessage({ id: 'dashboard.specialty.modal.export_modal.warning_message.export_selected' }),
			);
			return false;
		}

		const response = await doctorApi.export({ ...data, ...body });
		const fileName = 'doctors';
		downloadExcelFile(response, fileName);

		return true;
	}, languageId);

	const handleOnImport = async (doctors) => {
		const formattedData = doctors.map(({ importStatus, ...rest }) => rest);
		return await doctorApi.import(formattedData);
	};

	return (
		<>
			<Container id='page-main' className='py-5'>
				<ContainerGrid>
					<div className='row pb-4'>
						<div className='col-12 col-sm-6 mb-4 mb-sm-0'>
							<div className='d-flex gap-2'>
								<UnFieldDebounce
									delay={500}
									initialValue=''
									type='text'
									placeholderIntl='form.search_placeholder'
									ariallabel='search field'
									id='search-field'
									onChange={handleChangeSearch}
								/>
								<Dropdown
									size='md'
									name='specialtyId'
									value={queryParams.specialtyId}
									options={Specialties}
									onSelect={handleSelectSpecialty}
								/>
							</div>
						</div>
						<div className='col-12 col-sm-6'>
							<div className='d-flex gap-2 justify-content-sm-end'>
								<Button size='sm' square onClick={() => handleToggleModal(-1)}>
									<MdAdd size='1.25em' />
								</Button>
								<Button success size='sm' square onClick={toggleExportModal}>
									<BiExport size='1.25em' />
								</Button>
								<Button info size='sm' square onClick={toggleImportModal}>
									<BiImport size='1.25em' />
								</Button>
							</div>
						</div>
					</div>
					<TableGrid className='scrollbar'>
						<Table hover striped fixed>
							<TableHeader>
								<th className='text-center' style={{ width: '40px' }}>
									<UnFieldCheckBox id='checkbox-all' className='none-label text-center' onChange={toggleSelectAll} />
								</th>
								<th className='text-center' style={{ width: '80px' }}>
									<FormattedMessage id='table.no' />
								</th>
								<SortableTableHeader
									className='text-start'
									name='firstName'
									intl='form.firstName'
									onChange={handleChangeSort}
									style={{ width: '120px' }}
								/>
								<SortableTableHeader
									className='text-start'
									name='lastName'
									intl='form.lastName'
									onChange={handleChangeSort}
									style={{ width: '120px' }}
								/>
								<th className='text-start' style={{ width: '180px' }}>
									<FormattedMessage id='form.phone' />
								</th>
								<SortableTableHeader
									className='text-start'
									name='email'
									intl='form.email'
									onChange={handleChangeSort}
									style={{ width: '220px' }}
								/>
								<SortableTableHeader
									className='text-start'
									name='position'
									intl='common.position'
									onChange={handleChangeSort}
									style={{ width: '100px' }}
								/>
								<th className='text-center' style={{ width: '240px' }}>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody list={Doctors} isLoading={isLoading} columns={8}>
								{({ isSelected, _id: id, firstName, lastName, phone, email, position }, index) => (
									<tr key={id}>
										<td>
											<UnFieldCheckBox
												id={`checkbox-${id}`}
												className='none-label'
												checked={isSelected}
												onChange={() => toggleSelect(index)}
											/>
										</td>
										<td className='text-center'>{index + 1}</td>
										<td className='text-start'>{firstName}</td>
										<td className='text-start'>{lastName}</td>
										<td className='text-start'>{formatPhone(phone)}</td>
										<td className='text-start'>{email}</td>
										<td className='text-start'>{PositionLabels[position]}</td>
										<td>
											<div className='d-flex justify-content-center gap-2'>
												<Button success size='xs' info onClick={() => handleToggleModal(index)}>
													<FormattedMessage id='button.update' />
												</Button>
												<Button size='xs' danger onClick={() => handleToggleConfirmModal(index)}>
													<FormattedMessage id='button.delete' />
												</Button>
											</div>
										</td>
									</tr>
								)}
							</TableBody>
						</Table>
					</TableGrid>

					<FooterContainer
						pagesize={queryParams.pagesize}
						totalPages={queryParams.totalPages}
						handleSelect={handleSelect}
						handlePageChange={handlePageChange}
					/>
				</ContainerGrid>
			</Container>

			<DoctorModal
				isOpen={statusModal}
				specialties={Specialties}
				doctorId={Doctors[doctorIndex]?._id}
				genders={Genders}
				positions={Positions}
				onClose={toggleModal}
				onUpdate={handleOnUpdate}
				onCreate={handleOnCreate}
			/>

			<ExportModal isOpen={statusExportModal} onClose={toggleExportModal} onSubmit={handleOnExport} />

			<ImportExcelModal
				isOpen={statusImportModal}
				languageId={languageId}
				specialtyId={queryParams.specialtyId}
				genders={Genders}
				specialties={Specialties}
				positions={Positions}
				onClose={toggleImportModal}
				onSubmit={handleOnImport}
			/>

			<ConfirmModal
				idTitleIntl='dashboard.specialty.modal.deletion.title'
				isOpen={statusConfirmModal}
				onClose={toggleConfirmModal}
				onSubmit={handleOnSubmitDeletion}
			>
				<FormattedDescription
					id='dashboard.specialty.modal.deletion.description'
					values={{ email: Doctors[doctorIndex]?.email || '' }}
				/>
			</ConfirmModal>
		</>
	);
}
