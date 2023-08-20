import {
	Button,
	ConfirmModal,
	Container,
	FooterContainer,
	SortableTableHeader,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
	UnFieldDebounce,
} from '@/admin/components';

import { adminApi, authApi } from '@/admin/api';
import { useAdminRoles, useAsyncLocation, useCurrentIndex, useGenders, useToggle } from '@/admin/hooks';
import { compose } from '@/admin/utilities';
import { useAuth } from '@/hooks';
import { FormattedDescription } from '@/shared/components';
import { tryCatch } from '@/shared/utils';
import produce from 'immer';
import React from 'react';
import { MdAdd } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { AdminCreateModal, AdminEditModal } from '../../components';

export function AdminManager() {
	const { languageId } = useAuth();
	const { currentIndexRef: adminIndexRef, setCurrentIndex: updateAdminIndex } = useCurrentIndex(0);

	const {
		data: Admins,
		setData: setAdmins,
		queryParams,
		totalPages,
		handleOnChangeSort,
		handleOnChangeSearch,
		handleOnPageChange,
		handleOnSelect,
	} = useAsyncLocation({
		getData: adminApi.queryAdminByParams,
	});

	const { page = 1, pagesize = 25 } = queryParams;
	const Genders = useGenders(languageId);
	const AdminRoles = useAdminRoles(languageId);

	const [statusCreateModal, toggleCreateModal] = useToggle();
	const [statusProfileModal, toggleProfile] = useToggle();
	const [statusConfirmModal, toggleConfirmDeletionModal] = useToggle();

	const openProfileModal = compose(updateAdminIndex, toggleProfile);
	const openConfirmModal = compose(updateAdminIndex, toggleConfirmDeletionModal);

	const handleCreateAdmin = tryCatch(async (newAdmin) => {
		const { message, metadata } = await authApi.signUp(newAdmin);
		if (totalPages === +page && +pagesize > Admins.length) {
			setAdmins(
				produce((draft) => {
					draft.push(metadata);
				}),
			);
		}
		toast.success(message);
		toggleCreateModal();
	}, languageId);

	const handleConfirmDeletion = tryCatch(async () => {
		const { message } = await adminApi.deleteById(Admins[adminIndexRef.current]._id);
		setAdmins(
			produce((draft) => {
				draft.splice(adminIndexRef.current, 1);
			}),
		);
		toast.success(message);
		toggleConfirmDeletionModal();
	}, languageId);

	const handleUpdateAdmin = tryCatch(async (updateBody) => {
		const index = adminIndexRef.current;
		const id = Admins[index]._id;
		const { message, metadata } = await adminApi.updateById(id, updateBody);

		setAdmins(
			produce((draft) => {
				draft[index] = { ...draft[index], ...metadata };
			}),
		);

		toast.success(message);
		toggleProfile();
	}, languageId);

	return (
		<React.Fragment>
			<Container id='page-main'>
				<div className='d-flex flex-column h-100 py-5'>
					<div className='d-flex pb-4'>
						<div className='d-flex'>
							<UnFieldDebounce
								delay={500}
								onChange={handleOnChangeSearch}
								initialValue={queryParams.key_search || ''}
								type='text'
								placeholderIntl='form.search_placeholder'
								ariallabel='search field'
								id='search-field'
							/>
						</div>
						<div className='px-5 d-flex gap-2 ms-auto'>
							<Button size='sm' onClick={toggleCreateModal}>
								<span>
									<FormattedMessage id='button.create_user' />
								</span>
								<MdAdd size='1.25em' className='ms-2' />
							</Button>
						</div>
					</div>
					<TableGrid className='scrollbar'>
						<Table hover striped auto>
							<TableHeader>
								<th className='text-center'>
									<FormattedMessage id='table.no' />
								</th>
								<SortableTableHeader name='firstName' intl='form.first_name' onChange={handleOnChangeSort} />
								<SortableTableHeader name='lastName' intl='form.last_name' onChange={handleOnChangeSort} />
								<SortableTableHeader name='email' intl='form.email' onChange={handleOnChangeSort} />
								<th className='text-start'>
									<FormattedMessage id='form.phone' />
								</th>
								<th className='text-center'>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody>
								{Admins.map(({ _id, firstName, lastName, email, phone }, index) => (
									<tr key={_id}>
										<td className='text-center'>{index + 1}</td>
										<td className='text-start'>{firstName}</td>
										<td className='text-start'>{lastName}</td>
										<td className='text-start'>{email}</td>
										<td className='text-start'>{phone}</td>
										<td>
											<div className='d-flex justify-content-center gap-2'>
												<Button size='xs' success onClick={() => openProfileModal(index)}>
													<FormattedMessage id='button.update' />
												</Button>
												<Button size='xs' danger onClick={() => openConfirmModal(index)}>
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
						totalPages={totalPages}
						handleOnSelect={handleOnSelect}
						handleOnPageChange={handleOnPageChange}
					/>
				</div>
			</Container>

			<AdminCreateModal
				isOpen={statusCreateModal}
				onClose={toggleCreateModal}
				onSubmit={handleCreateAdmin}
				genders={Genders}
				positions={AdminRoles}
			/>

			<AdminEditModal
				isOpen={statusProfileModal}
				defaultValues={Admins[adminIndexRef.current]}
				genders={Genders}
				positions={AdminRoles}
				onSubmit={handleUpdateAdmin}
				onClose={toggleProfile}
			/>

			<ConfirmModal
				idTitleIntl='dashboard.admin.modal.confirm_deletion_admin.title'
				isOpen={statusConfirmModal}
				onClose={toggleConfirmDeletionModal}
				onSubmit={handleConfirmDeletion}>
				<FormattedDescription
					id='dashboard.admin.modal.confirm_deletion_admin.description'
					values={{ email: Admins[adminIndexRef.current]?.email ?? '' }}
				/>
			</ConfirmModal>
		</React.Fragment>
	);
}
