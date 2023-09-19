import { doctorApi } from 'admin/api';
import {
	Button,
	ConfirmModal,
	Container,
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
} from 'admin/components';
import { useCurrentIndex, useFetchResource, useToggle } from 'admin/hooks';
import { compose, getObjectDiff, tryCatchAndToast } from 'admin/utilities';
import { useAuth } from 'hooks';
import produce from 'immer';
import { MdAdd, MdImportExport } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { CreateDoctorModal, ExportModal, ImportExcelModal, ProfileDoctorModal } from '../../components';
import { useManageSpecialties } from '../../hooks';
import { getHandleExport } from '../../utils/export.strategy';

export function SpecialtyManager() {
	const {
		info: { languageId },
	} = useAuth();

	const { currentIndexRef: doctorIndexRef, setCurrentIndex: setDoctorIndex } = useCurrentIndex();

	const {
		Specialties,
		Doctors,
		Positions,
		queryParams,
		setDoctors,
		handleOnSelect,
		handleOnChangeSort,
		handleOnChangeSearch,
		handleOnPageChange,
		handleSelectSpecialty,
	} = useManageSpecialties(languageId);

	const positionLabels = Positions.reduce((obj, { value, label }) => {
		obj[value] = label;
		return obj;
	}, {});

	const Genders = useFetchResource({
		endpoint: 'gender',
		languageId,
		formatter: (genders) =>
			genders.map(({ key, name }) => {
				return { label: name[languageId], value: key };
			}),
	});

	const [isOpenCreateModal, toggleCreateModal] = useToggle();
	const [isOpenProfileModal, toggleProfileModal] = useToggle();
	const [isOpenConfirmModal, toggleConfirmModal] = useToggle();
	const [isOpenExportModal, toggleExportModal] = useToggle();
	const [isOpenImportModal, toggleImportModal] = useToggle();

	const handleOpenProfileModal = compose(setDoctorIndex, toggleProfileModal);
	const handleOpenConfirmDeletionModal = compose(setDoctorIndex, toggleConfirmModal);

	const handleUpdateDoctor = tryCatchAndToast(async ({ id, data }) => {
		const updateBody = getObjectDiff(Doctors[doctorIndexRef.current], data);

		const { message, metadata } = await doctorApi.updateOne({ id, updateBody });

		if (Object.keys(metadata).length) {
			setDoctors(
				produce((draft) => {
					Object.keys(metadata).forEach((key) => {
						if (key !== '_id' && key !== 'description') {
							draft[doctorIndexRef.current][key] = metadata[key];
						}
					});
				}),
			);
		}

		toast.success(message[languageId]);
		toggleProfileModal();
	}, languageId);

	const handleCreateDoctor = tryCatchAndToast(async (newDoctor) => {
		const { metadata, message } = await doctorApi.createOne(newDoctor);
		toast.success(message[languageId]);

		if (Doctors.length < +queryParams.pagesize) {
			setDoctors(
				produce((draft) => {
					delete newDoctor.description;
					draft.push(metadata);
				}),
			);
		}
		toggleCreateModal();
	}, languageId);

	const handleDeleteDoctor = tryCatchAndToast(async () => {
		const doctor = Doctors[doctorIndexRef.current] || {};
		if (doctor && doctor._id) {
			const { message } = await doctorApi.deleteOne(doctor._id);
			setDoctors(
				produce((draft) => {
					draft.splice(doctorIndexRef.current, 1);
				}),
			);
			toggleConfirmModal();
			toast.success(message[languageId]);
		}
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

	const handleExportDoctor = tryCatchAndToast(async (data) => {
		const body = getHandleExport(data.type, Doctors, queryParams);

		console.log(body);
	}, languageId);

	const handleImportDoctor = async (doctors) => {
		const formattedData = doctors.map(({ importStatus, ...rest }) => rest);
		return await doctorApi.import(formattedData);
	};

	return (
		<>
			<Container id='page-main'>
				<div className='d-flex flex-column h-100 py-5'>
					<div className='d-flex pb-4'>
						<div className='d-flex items-end gap-2'>
							<Dropdown
								size='md'
								name='specialtyId'
								value={queryParams.specialtyId}
								options={Specialties}
								onSelect={handleSelectSpecialty}
							/>
							<div className='d-flex'>
								<UnFieldDebounce
									delay={500}
									initialValue=''
									type='text'
									placeholderIntl='form.search_placeholder'
									ariallabel='search field'
									id='search-field'
									onChange={handleOnChangeSearch}
								/>
							</div>
						</div>
						<div className='px-5 d-flex gap-2 ms-auto'>
							<Button size='sm' onClick={toggleCreateModal}>
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
					<TableGrid className='scrollbar'>
						<Table hover striped auto>
							<TableHeader>
								<th className='text-center'>
									<UnFieldCheckBox id='checkbox-all' className='none-label text-center' onChange={toggleSelectAll} />
								</th>
								<th className='text-center'>
									<FormattedMessage id='table.no' />
								</th>
								<SortableTableHeader
									className='text-start'
									name='firstName'
									intl='form.firstName'
									onChange={handleOnChangeSort}
								/>
								<SortableTableHeader
									className='text-start'
									name='lastName'
									intl='form.lastName'
									onChange={handleOnChangeSort}
								/>
								<th className='text-start'>
									<FormattedMessage id='form.phone' />
								</th>
								<SortableTableHeader
									className='text-start'
									name='email'
									intl='form.email'
									onChange={handleOnChangeSort}
								/>
								<SortableTableHeader
									className='text-start'
									name='position'
									intl='common.position'
									onChange={handleOnChangeSort}
								/>
								<th className='text-center'>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody>
								{Doctors.map(({ isSelected, _id: id, firstName, lastName, phone, email, position }, index) => (
									<tr key={id}>
										<th>
											<UnFieldCheckBox
												id={`checkbox-${id}`}
												className='none-label'
												checked={isSelected}
												onChange={() => toggleSelect(index)}
											/>
										</th>
										<td className='text-center'>{index + 1}</td>
										<td className='text-start'>{firstName}</td>
										<td className='text-start'>{lastName}</td>
										<td className='text-start'>{phone}</td>
										<td className='text-start'>{email}</td>
										<td className='text-start'>{positionLabels[position]}</td>
										<td>
											<div className='d-flex justify-content-center gap-2'>
												<Button success size='xs' info onClick={() => handleOpenProfileModal(index)}>
													<FormattedMessage id='button.update' />
												</Button>
												<Button size='xs' danger onClick={() => handleOpenConfirmDeletionModal(index)}>
													<FormattedMessage id='button.delete' />
												</Button>
											</div>
										</td>
									</tr>
								))}
							</TableBody>
						</Table>
					</TableGrid>

					<FooterContainer
						pagesize={queryParams.pagesize}
						totalPages={queryParams.totalPages}
						handleOnSelect={handleOnSelect}
						handleOnPageChange={handleOnPageChange}
					/>
				</div>
			</Container>

			<CreateDoctorModal
				specialtyId={queryParams.specialtyId}
				isOpen={isOpenCreateModal}
				genders={Genders}
				specialties={Specialties}
				positions={Positions}
				onClose={toggleCreateModal}
				onSubmit={handleCreateDoctor}
			/>

			<ProfileDoctorModal
				isOpen={isOpenProfileModal}
				specialties={Specialties}
				doctor={Doctors[doctorIndexRef.current]}
				genders={Genders}
				positions={Positions}
				onClose={toggleProfileModal}
				onSubmit={handleUpdateDoctor}
			/>

			<ConfirmModal
				idTitleIntl='dashboard.specialty.modal.confirm_deletion.title'
				isOpen={isOpenConfirmModal}
				onClose={toggleConfirmModal}
				onSubmit={handleDeleteDoctor}
			>
				<FormattedDescription
					id='dashboard.specialty.modal.confirm_deletion.description'
					values={{ email: Doctors[doctorIndexRef.current]?.email || '' }}
				/>
			</ConfirmModal>

			<ExportModal
				titleIntl='dashboard.specialty.modal.export_modal.title'
				isOpen={isOpenExportModal}
				onClose={toggleExportModal}
				onSubmit={handleExportDoctor}
			/>

			<ImportExcelModal
				isOpen={isOpenImportModal}
				languageId={languageId}
				specialtyId={queryParams.specialtyId}
				genders={Genders}
				specialties={Specialties}
				positions={Positions}
				onClose={toggleImportModal}
				onSubmit={handleImportDoctor}
			/>
		</>
	);
}
