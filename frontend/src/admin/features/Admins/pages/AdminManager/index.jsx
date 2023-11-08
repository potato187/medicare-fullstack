import { dataToLabelValueMap, keyToLabelReducer } from 'admin/utils';
import { adminApi, resourceApi } from 'api';
import {
	Button,
	ConfirmModal,
	Container,
	ContainerGrid,
	FooterContainer,
	FormattedDescription,
	SortableTableHeader,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
	UnFieldDebounce,
} from 'components';
import { useAsyncLocation, useAuth, useIndex, useToggle } from 'hooks';
import produce from 'immer';
import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { compose, showToastMessage, tryCatch, tryCatchAndToast } from 'utils';
import { AdminModal } from '../../components';

export default function AdminManager() {
	const {
		info: { languageId },
	} = useAuth();
	const { index: adminIndex, setIndex: updateAdminIndex } = useIndex(0);

	const {
		data: Admins,
		queryParams,
		totalPages,
		isLoading,
		setData: setAdmins,
		handleChangeSort,
		handleChangeSearch,
		handlePageChange,
		handleSelect,
	} = useAsyncLocation({
		fetch: adminApi.queryAdminByParams,
	});
	const [data, setData] = useState({
		AdminRoles: [],
		Genders: [],
	});

	const Genders = dataToLabelValueMap(data.Genders, languageId);
	const RoleOptions = dataToLabelValueMap(data.AdminRoles, languageId);
	const Roles = keyToLabelReducer(data.AdminRoles, languageId);

	const { page = 1, pagesize = 25 } = queryParams;
	const [statusModal, toggleModal] = useToggle();
	const [statusConfirmModal, toggleConfirmDeletionModal] = useToggle();

	const toggleModalAdmin = compose(updateAdminIndex, toggleModal);
	const toggleConfirmModal = compose(updateAdminIndex, toggleConfirmDeletionModal);

	const handleCreate = tryCatchAndToast(async (newAdmin) => {
		const { message, metadata } = await adminApi.createOne(newAdmin);
		if (totalPages === +page && +pagesize > Admins.length) {
			setAdmins(
				produce((draft) => {
					draft.push(metadata);
				}),
			);
		}
		showToastMessage(message, languageId);
		toggleModalAdmin();
	}, languageId);

	const handleConfirmDeletion = tryCatchAndToast(async () => {
		const { message } = await adminApi.deleteById(Admins[adminIndex]._id);
		setAdmins(
			produce((draft) => {
				draft.splice(adminIndex, 1);
			}),
		);
		showToastMessage(message, languageId);
		toggleConfirmModal();
	}, languageId);

	const handleUpdate = tryCatchAndToast(async (data) => {
		if (Object.keys(data).length) {
			const { message, metadata } = await adminApi.updateById(Admins[adminIndex]._id, data);

			setAdmins(
				produce((draft) => {
					Object.entries(metadata).forEach(([key, value]) => {
						if (Object.hasOwn(draft[adminIndex], key)) {
							draft[adminIndex][key] = value;
						}
					});
				}),
			);

			showToastMessage(message, languageId);
		}
	}, languageId);

	useEffect(() => {
		tryCatch(async () => {
			const promises = [resourceApi.getAll({ model: 'gender' }), resourceApi.getAll({ model: 'role' })];
			const response = await Promise.allSettled(promises);
			const [genders, roles] = response.map((res) => (res.status === 'fulfilled' ? res.value.metadata : []));
			setData(
				produce((draft) => {
					draft.AdminRoles = [...roles];
					draft.Genders = [...genders];
				}),
			);
		})();
	}, []);

	return (
		<>
			<Container id='page-main' className='py-5'>
				<ContainerGrid>
					<div className='row px-2 pb-4'>
						<div className='col-8 col-sm-3'>
							<UnFieldDebounce
								delay={500}
								onChange={handleChangeSearch}
								initialValue={queryParams.search || ''}
								type='text'
								placeholderIntl='form.search_placeholder'
								ariallabel='search field'
								id='search-field'
							/>
						</div>
						<div className='col-4 col-sm-9'>
							<div className='d-flex justify-content-end'>
								<Button square size='sm' onClick={toggleModalAdmin}>
									<MdAdd size='1.25em' />
								</Button>
							</div>
						</div>
					</div>
					<TableGrid className='scrollbar'>
						<Table hover striped fixed>
							<TableHeader>
								<th className='text-center' style={{ width: '80px' }}>
									<FormattedMessage id='table.no' />
								</th>
								<SortableTableHeader
									name='firstName'
									intl='form.firstName'
									onChange={handleChangeSort}
									style={{ width: '160px' }}
								/>
								<SortableTableHeader
									name='lastName'
									intl='form.lastName'
									onChange={handleChangeSort}
									style={{ width: '160px' }}
								/>
								<SortableTableHeader
									name='email'
									intl='form.email'
									onChange={handleChangeSort}
									style={{ width: '240px' }}
								/>
								<th className='text-start' style={{ width: '120px' }}>
									<FormattedMessage id='form.phone' />
								</th>
								<th className='text-start' style={{ width: '120px' }}>
									<FormattedMessage id='common.role' />
								</th>
								<th className='text-center' style={{ width: '240px' }}>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody isLoading={isLoading} list={Admins} columns={7}>
								{({ _id, firstName, lastName, email, phone, role }, index) => (
									<tr key={_id}>
										<td className='text-center'>{index + 1}</td>
										<td className='text-start'>{firstName}</td>
										<td className='text-start'>{lastName}</td>
										<td className='text-start'>{email}</td>
										<td className='text-start'>{phone}</td>
										<td className='text-start'>{Roles[role]}</td>
										<td>
											<div className='d-flex justify-content-center gap-2'>
												<Button size='xs' success onClick={() => toggleModalAdmin(index)}>
													<FormattedMessage id='button.update' />
												</Button>
												<Button size='xs' danger onClick={() => toggleConfirmModal(index)}>
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
						totalPages={totalPages}
						handleSelect={handleSelect}
						handlePageChange={handlePageChange}
					/>
				</ContainerGrid>
			</Container>

			<AdminModal
				isOpen={statusModal}
				adminId={Admins[adminIndex]?._id}
				genders={Genders}
				positions={RoleOptions}
				onClose={toggleModal}
				onCreate={handleCreate}
				onUpdate={handleUpdate}
			/>

			<ConfirmModal
				idTitleIntl='dashboard.admin.modal.deletion.title'
				isOpen={statusConfirmModal}
				onClose={toggleConfirmDeletionModal}
				onSubmit={handleConfirmDeletion}
			>
				<FormattedDescription
					id='dashboard.admin.modal.deletion.description'
					values={{ email: Admins[adminIndex]?.email ?? '' }}
				/>
			</ConfirmModal>
		</>
	);
}
