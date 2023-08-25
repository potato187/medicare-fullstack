/* eslint-disable */
import produce from 'immer';
import React, { useRef } from 'react';
import { MdAdd, MdImportExport } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { doctorApi } from '@/admin/service';
import {
	Button,
	ConfirmModal,
	Container,
	Dropdown,
	DropdownIntl,
	FooterContainer,
	PaginationSelector,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
	SortableTableHeader,
	UnFieldCheckBox,
	UnFieldDebounce,
} from '@/admin/components';
import { PAGINATION_OPTIONS, SEARCH_OPTIONS, SPECIALTY_ID_DEFAULT } from '@/admin/constant';
import { useAsyncLocation, useFetchSpecialty, useQuery, useToggle } from '@/admin/hooks';
import { compose } from '@/admin/utilities';
import { useAuth } from '@/hooks';
import { downloadExcelFile } from '@/utils';
import { BasePagination, FormattedDescription } from '@/shared/components';
import { CreateDoctorModal, ExportModal, ImportExcelModal, ProfileDoctorModal } from '../../components';

export function SpecialtyManager() {
	const { languageId } = useAuth();
	const doctorIndexRef = useRef(0);
	const intl = useIntl();

	const {
		data: Doctors,
		setData: setDoctors,
		searchBy,
		queryParams,
		handleOnSort,
		handleOnSelect,
		handleOnChangeSearch,
		handleOnPageChange,
	} = useAsyncLocation({
		fetchFnc: doctorApi.getAll,
		params: {
			specialtyId: SPECIALTY_ID_DEFAULT,
			sort: ['positionId,asc'],
			search_by: 'all',
			search: '',
		},
	});

	const { Genders } = useQuery(
		'Genders',
		{
			from: 'gender',
			attributes: [['genderId', 'id'], 'value_vi', 'value_en'],
		},
		(response) => response.map((gender) => ({ value: gender.id, label: gender[`value_${languageId}`] })),
	);

	const { Positions } = useQuery(
		'Positions',
		{
			from: 'position',
			attributes: [['positionId', 'id'], 'value_vi', 'value_en'],
			search_by: 'positionId',
			search: 'DOC',
		},
		(response) =>
			response.map((position) => ({
				value: position.id,
				label: position[`value_${languageId}`],
			})),
	);

	const positionLabels = Positions.length
		? Positions.reduce((obj, { value, label }) => ({ ...obj, [value]: label }), {})
		: {};

	const { memorizedOptions: specialtiesOptions, updateSpecialties } = useFetchSpecialty({
		language: languageId,
		entity: 'Doctors',
		entityIdField: 'id',
	});

	const [statusProfileModal, toggleProfileModal] = useToggle();
	const [statusCreateDoctorModal, toggleCreateDoctorModal] = useToggle();
	const [statusConfirmDeletionModal, toggleConfirmDeletionModal] = useToggle();
	const [statusExportModal, toggleExportModal] = useToggle();
	const [statusImportModal, toggleImportModal] = useToggle();

	const updateDoctorIndex = (index) => {
		if (doctorIndexRef.current !== index) {
			doctorIndexRef.current = index;
		}
	};

	const handleOpenProfileModal = compose(updateDoctorIndex, toggleProfileModal);

	const handleOpenConfirmDeletionModal = compose(updateDoctorIndex, toggleConfirmDeletionModal);

	const toggleSelectedAll = (event) => {
		const { checked } = event.target;
		setDoctors(
			produce((draft) => {
				draft.forEach((item) => {
					item.isSelected = checked;
				});
			}),
		);
	};

	const toggleSelectedById = (id) => {
		setDoctors(
			produce((draft) => {
				const index = draft.findIndex((doctor) => doctor.id === id);
				draft[index].isSelected = !draft[index].isSelected;
			}),
		);
	};

	const handleUpdateDoctor = async (data) => {
		try {
			const { message } = await doctorApi.updateOne(data);
			toast.success(message[languageId]);
			const needUpdateSpecialties = data.specialtyId !== queryParams.specialtyId;

			setDoctors(
				produce((draft) => {
					const index = doctorIndexRef.current;
					if (needUpdateSpecialties) {
						draft.splice(index, 1);
					} else {
						draft[index] = { ...data };
						1;
					}
				}),
			);

			if (needUpdateSpecialties) {
				updateSpecialties(
					produce((draft) => {
						const prevIndex = draft.findIndex((specialty) => specialty.value === queryParams.specialtyId);
						const index = draft.findIndex((specialty) => specialty.value === data.specialtyId);
						draft[prevIndex].totalDoctors -= 1;
						draft[index].totalDoctors += 1;
					}),
				);
			}

			toggleProfileModal();
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleCreateDoctor = async (newDoctor) => {
		let createSuccessfully = true;
		try {
			const { data, message } = await doctorApi.createOne(newDoctor);
			toast.success(message[languageId]);

			if (Doctors.length < +queryParams.per_page) {
				setDoctors(
					produce((draft) => {
						delete newDoctor.description;
						draft.push({ ...newDoctor, ...data });
					}),
				);
			}

			toggleCreateDoctorModal();
		} catch (error) {
			createSuccessfully = false;
			toast.error(error.message[languageId]);
		}

		return createSuccessfully;
	};

	const handleDeleteDoctor = async () => {
		const doctor = Doctors[doctorIndexRef.current];
		if (!doctor) return;

		try {
			const { message } = await doctorApi.deleteOne(doctor.id);
			setDoctors(
				produce((draft) => {
					draft.splice(doctorIndexRef.current, 1);
				}),
			);
			updateSpecialties(
				produce((draft) => {
					const index = draft.findIndex((specialty) => specialty.value === doctor.specialtyId);
					draft[index].totalsDoctors -= 1;
				}),
			);
			toggleConfirmDeletionModal();
			toast.success(message[languageId]);
		} catch (error) {
			toast.error(error.message[languageId]);
		}
	};

	const handleExportDoctor = async (data) => {
		data.specialtyId = queryParams.specialtyId;
		try {
			if (data.export_option === 'selected') {
				data.selectedDoctors = Doctors.reduce((haystack, { id, isSelected }) => {
					if (isSelected) {
						haystack.push(id);
					}
					return haystack;
				}, []);

				if (!data.selectedDoctors.length) {
					toast.warning(
						intl.formatMessage({ id: 'dashboard.specialty.modal.export_modal.warning_message.export_selected' }),
					);
					return false;
				}
			}

			if (data.export_option === 'per_page') {
				data.per_page = queryParams.pp;
				data.page = queryParams.p;
			}

			const response = await doctorApi.exportData(data);
			const fileName = 'doctors';
			downloadExcelFile(response, fileName);
		} catch (error) {
			console.log(error);
		}
	};

	const handleImportDoctor = async (data) => {
		try {
			const { data: responseData = [], message } = await doctorApi.importData(data, queryParams.specialtyId);
			toast.success(message[languageId]);
			return responseData.doctors;
		} catch (error) {
			toast.error(error.message[languageId]);
		}
	};

	return (
		<>
			<Container id='page-main'>
				<div className='d-flex flex-column h-100 py-5'>
					<div className='d-flex pb-4'>
						<div className='d-flex items-end gap-2'>
							<Dropdown
								showCounter
								size='md'
								name='specialtyId'
								value={queryParams.specialtyId}
								options={specialtiesOptions}
								onSelect={handleOnSelect}
							/>
							<div className='d-flex'>
								<DropdownIntl name='search_by' options={SEARCH_OPTIONS} value={searchBy} onSelect={handleOnSelect} />
								<UnFieldDebounce
									delay={500}
									onChange={handleOnChangeSearch}
									initialValue={queryParams.search || ''}
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

					<TableGrid className='scrollbar'>
						<Table hover striped auto>
							<TableHeader>
								<th className='text-center'>
									<UnFieldCheckBox onChange={toggleSelectedAll} className='none-label text-center' />
								</th>
								<th className='text-center'>
									<FormattedMessage id='table.no' />
								</th>
								<SortableTableHeader
									className='text-start'
									sortMap={queryParams.sort}
									name='first_name'
									intl='form.first_name'
									onSort={handleOnSort}
								/>
								<SortableTableHeader
									className='text-start'
									sortMap={queryParams.sort}
									name='last_name'
									intl='form.last_name'
									onSort={handleOnSort}
								/>
								<th className='text-start'>
									<FormattedMessage id='form.phone' />
								</th>
								<SortableTableHeader
									className='text-start'
									sortMap={queryParams.sort}
									name='email'
									intl='form.email'
									onSort={handleOnSort}
								/>
								<SortableTableHeader
									className='text-start'
									sortMap={queryParams.sort}
									name='positionId'
									intl='common.position'
									onSort={handleOnSort}
								/>
								<th className='text-center'>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody>
								{Doctors.map(({ isSelected, id, first_name, last_name, phone, email, positionId }, index) => (
									<tr key={id}>
										<th>
											<UnFieldCheckBox
												className='none-label'
												checked={isSelected}
												onChange={() => toggleSelectedById(id)}
											/>
										</th>
										<td className='text-center'>{index + 1}</td>
										<td className='text-start'>{first_name}</td>
										<td className='text-start'>{last_name}</td>
										<td className='text-start'>{phone}</td>
										<td className='text-start'>{email}</td>
										<td className='text-start'>{positionLabels[positionId]}</td>
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
						per_page={queryParams.per_page}
						totalPages={queryParams.totalPages}
						handleOnSelect={handleOnSelect}
						handleOnPageChange={handleOnPageChange}
					/>
				</div>
			</Container>

			<ProfileDoctorModal
				isOpen={statusProfileModal}
				specialties={specialtiesOptions}
				defaultValues={Doctors[doctorIndexRef.current]}
				genders={Genders}
				positions={Positions}
				onClose={toggleProfileModal}
				onSubmit={handleUpdateDoctor}
			/>
			<CreateDoctorModal
				isOpen={statusCreateDoctorModal}
				genders={Genders}
				specialties={specialtiesOptions}
				positions={Positions}
				onClose={toggleCreateDoctorModal}
				onSubmit={handleCreateDoctor}
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
			<ImportExcelModal
				isOpen={statusImportModal}
				specialtyId={queryParams.specialtyId}
				genders={Genders}
				specialties={specialtiesOptions}
				positions={Positions}
				onClose={toggleImportModal}
				onSubmit={handleImportDoctor}
			/>
		</>
	);
}
