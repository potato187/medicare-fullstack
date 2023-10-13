import { adminApi, resourceApi } from 'api';
import {
	Button,
	ConfirmModal,
	Container,
	FooterContainer,
	FormattedDescription,
	SortableTableHeader,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
	UnFieldDebounce,
} from 'components';
import { useAsyncLocation, useIndex, useToggle, useAuth } from 'hooks';
import { compose, mapData, showToastMessage, tryCatch, tryCatchAndToast } from 'utils';
import produce from 'immer';
import { useEffect, useMemo, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { AdminModal } from '../../components';

export default function AdminManager() {
	const {
		info: { languageId },
	} = useAuth();
	const { index: adminIndex, setIndex: updateAdminIndex } = useIndex(0);

	const {
		data: Admins,
		setData: setAdmins,
		queryParams,
		totalPages,
		isLoading,
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

	const Genders = useMemo(() => {
		return mapData(data.Genders, languageId);
	}, [data, languageId]);

	const AdminRoles = useMemo(() => {
		return mapData(data.AdminRoles, languageId);
	}, [data, languageId]);

	const { page = 1, pagesize = 25 } = queryParams;
	const [statusModal, toggleModal] = useToggle();
	const [statusConfirmModal, toggleConfirmDeletionModal] = useToggle();

	const openAdminModal = compose(updateAdminIndex, toggleModal);
	const openConfirmModal = compose(updateAdminIndex, toggleConfirmDeletionModal);

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
		toggleModal();
	}, languageId);

	const handleConfirmDeletion = tryCatchAndToast(async () => {
		const { message } = await adminApi.deleteById(Admins[adminIndex]._id);
		setAdmins(
			produce((draft) => {
				draft.splice(adminIndex, 1);
			}),
		);
		showToastMessage(message, languageId);
		toggleConfirmDeletionModal();
	}, languageId);

	const handleOnUpdate = tryCatchAndToast(async (data) => {
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

		toggleModal();
	}, languageId);

	useEffect(() => {
		tryCatch(async () => {
			const promises = [
				resourceApi.getAll({
					model: 'gender',
				}),
				resourceApi.getAll({
					model: 'role',
				}),
			];
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
			<Container id='page-main'>
				<div className='d-flex flex-column h-100 py-5'>
					<div className='d-flex pb-4'>
						<div className='d-flex'>
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
						<div className='px-5 d-flex gap-2 ms-auto'>
							<Button size='sm' onClick={openAdminModal}>
								<span>
									<FormattedMessage id='button.create_user' />
								</span>
								<MdAdd size='1.25em' className='ms-2' />
							</Button>
						</div>
					</div>
					<TableGrid className='scrollbar'>
						<Table hover striped auto={1}>
							<TableHeader>
								<th className='text-center'>
									<FormattedMessage id='table.no' />
								</th>
								<SortableTableHeader name='firstName' intl='form.firstName' onChange={handleChangeSort} />
								<SortableTableHeader name='lastName' intl='form.lastName' onChange={handleChangeSort} />
								<SortableTableHeader name='email' intl='form.email' onChange={handleChangeSort} />
								<th className='text-start'>
									<FormattedMessage id='form.phone' />
								</th>
								<th className='text-center'>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody isLoading={isLoading} list={Admins}>
								{({ _id, firstName, lastName, email, phone }, index) => (
									<tr key={_id}>
										<td className='text-center'>{index + 1}</td>
										<td className='text-start'>{firstName}</td>
										<td className='text-start'>{lastName}</td>
										<td className='text-start'>{email}</td>
										<td className='text-start'>{phone}</td>
										<td>
											<div className='d-flex justify-content-center gap-2'>
												<Button size='xs' success onClick={() => openAdminModal(index)}>
													<FormattedMessage id='button.update' />
												</Button>
												<Button size='xs' danger onClick={() => openConfirmModal(index)}>
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
				</div>
			</Container>

			<AdminModal
				isOpen={statusModal}
				adminId={Admins[adminIndex]?._id}
				genders={Genders}
				positions={AdminRoles}
				onClose={toggleModal}
				onCreate={handleCreate}
				onUpdate={handleOnUpdate}
			/>

			<ConfirmModal
				idTitleIntl='dashboard.admin.modal.confirm_deletion_admin.title'
				isOpen={statusConfirmModal}
				onClose={toggleConfirmDeletionModal}
				onSubmit={handleConfirmDeletion}
			>
				<FormattedDescription
					id='dashboard.admin.modal.confirm_deletion_admin.description'
					values={{ email: Admins[adminIndex]?.email ?? '' }}
				/>
			</ConfirmModal>
		</>
	);
}
