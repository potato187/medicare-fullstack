/* eslint-disable */
import {
	Button,
	Container,
	Dropdown,
	SortableTableHeader,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
	UnFieldCheckBox,
	UnFieldDebounce,
} from 'admin/components';
import { useManageSpecialties, useToggle } from 'admin/hooks';
import { MdAdd, MdImportExport } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

export function SpecialtyManager() {
	/* 	const { languageId } = useAuth(); */

	const { Specialties, Doctors, Positions, queryParams, handleOnSelect, handleOnChangeSort, handleOnChangeSearch } =
		useManageSpecialties();

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
						<Dropdown
							size='md'
							name='specialtyId'
							value={queryParams.specialtyId}
							options={Specialties}
							onSelect={handleOnSelect}
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
								<UnFieldCheckBox className='none-label text-center' />
							</th>
							<th className='text-center'>
								<FormattedMessage id='table.no' />
							</th>
							<SortableTableHeader
								className='text-start'
								name='firstName'
								intl='form.first_name'
								onChange={handleOnChangeSort}
							/>
							<SortableTableHeader
								className='text-start'
								name='lastName'
								intl='form.last_name'
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
											className='none-label'
											checked={isSelected}
											onChange={() => toggleSelectedById(id)}
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
			</div>
		</Container>
	);
}
