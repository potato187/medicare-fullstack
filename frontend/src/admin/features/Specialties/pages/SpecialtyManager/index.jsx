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
import { useCurrentIndex, useFetchResource, useManageSpecialties, useToggle } from 'admin/hooks';
import { compose, tryCatchAndToast } from 'admin/utilities';
import { useAuth } from 'hooks';
import produce from 'immer';
import { useMemo } from 'react';
import { MdAdd, MdImportExport } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { downloadExcelFile } from 'utils';
import { CreateDoctorModal, ExportModal, ProfileDoctorModal } from '../../components';

export function SpecialtyManager() {
	const intl = useIntl();
	const {
		info: { languageId },
	} = useAuth();

	const { currentIndexRef: doctorIndexRef, setCurrentIndex: setDoctorIndex } = useCurrentIndex();

	const {
		Specialties,
		Doctors,
		setDoctors,
		Positions,
		queryParams,
		handleOnSelect,
		handleOnChangeSort,
		handleOnChangeSearch,
		handleOnPageChange,
		handleSelectSpecialty,
	} = useManageSpecialties(languageId);

	const positionOptions = useMemo(() => {
		return Object.entries(Positions).map(([key, value]) => ({ label: value, value: key }));
	}, [Positions]);

	const Genders = useFetchResource({
		endpoint: 'gender',
		languageId,
		formatter: (genders) =>
			genders.map(({ key, name }) => {
				return { label: name[languageId], value: key };
			}),
	});
	/* eslint-disable */
	const [statusCreateDoctorModal, toggleCreateDoctorModal] = useToggle();
	const [statusProfileModal, toggleProfileModal] = useToggle();
	const [statusConfirmDeletionModal, toggleConfirmDeletionModal] = useToggle();
	const [statusExportModal, toggleExportModal] = useToggle();
	const [statusImportModal, toggleImportModal] = useToggle();

	const handleOpenProfileModal = compose(setDoctorIndex, toggleProfileModal);
	const handleOpenConfirmDeletionModal = compose(setDoctorIndex, toggleConfirmDeletionModal);

	const handleUpdateDoctor = tryCatchAndToast(async ({ id, updateBody }) => {
		if (Object.keys(updateBody).length) {
			const { message, metadata } = await doctorApi.updateOne({
				id,
				updateBody,
			});

			setDoctors(
				produce((draft) => {
					Object.keys(metadata).forEach((key) => {
						if (key !== '_id' && key !== 'description') {
							draft[doctorIndexRef.current][key] = metadata[key];
						}
					});
				}),
			);

			toast.success(message[languageId]);
		}

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
		toggleCreateDoctorModal();
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
			toggleConfirmDeletionModal();
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
		if (data.type === 'selected') {
			data.ids = Doctors.reduce((arr, { _id, isSelected }) => {
				if (isSelected) {
					arr.push(_id);
				}
				return arr;
			}, []);

			if (!data.ids.length) {
				toast.warning(
					intl.formatMessage({ id: 'dashboard.specialty.modal.export_modal.warning_message.export_selected' }),
				);
				return false;
			}
		}

		if (data.type === 'page') {
			data.pagesize = queryParams.pagesize;
			data.page = queryParams.page;
			data.specialtyId = queryParams.specialtyId;
		}

		data.sort = queryParams.sort;
		const response = await doctorApi.export(data);
		const fileName = 'doctors';
		downloadExcelFile(response, fileName);

		toggleExportModal();
	}, languageId);

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
					<TableGrid className='scrollbar'>
						<Table hover striped auto>
							<TableHeader>
								<th className='text-center'>
									<UnFieldCheckBox className='none-label text-center' onChange={toggleSelectAll} />
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
										<td className='text-start'>{Positions[position]}</td>
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
				isOpen={statusCreateDoctorModal}
				genders={Genders}
				specialties={Specialties}
				positions={positionOptions}
				onClose={toggleCreateDoctorModal}
				onSubmit={handleCreateDoctor}
			/>

			<ProfileDoctorModal
				isOpen={statusProfileModal}
				specialties={Specialties}
				defaultValues={Doctors[doctorIndexRef.current]}
				genders={Genders}
				positions={positionOptions}
				onClose={toggleProfileModal}
				onSubmit={handleUpdateDoctor}
			/>

			<ConfirmModal
				idTitleIntl='dashboard.specialty.modal.confirm_deletion.title'
				isOpen={statusConfirmDeletionModal}
				onClose={toggleConfirmDeletionModal}
				onSubmit={handleDeleteDoctor}
			>
				<FormattedDescription
					id='dashboard.specialty.modal.confirm_deletion.description'
					values={{ email: Doctors[doctorIndexRef.current]?.email || '' }}
				/>
			</ConfirmModal>

			<ExportModal
				titleIntl='dashboard.specialty.modal.export_modal.title'
				isOpen={statusExportModal}
				onClose={toggleExportModal}
				onSubmit={handleExportDoctor}
			/>
		</>
	);
}
