import { adminApi } from '@/admin/api';
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

import { useAsyncLocation, useCurrentIndex, useGenders, usePositions, useToggle } from '@/admin/hooks';
import { compose } from '@/admin/utilities';
import { useAuth } from '@/hooks';
import { FormattedDescription } from '@/shared/components';
import produce from 'immer';
import React from 'react';
import { MdAdd } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { AdminCreateModal, AdminEditModal } from '../../components';
import { tryCatch } from '@/shared/utils';

export function AdminManager() {
	const { languageId } = useAuth();
	const { currentIndexRef: adminIndexRef, setCurrentIndex: updateAdminIndex } = useCurrentIndex(0);

	const {
		data: Admins,
		setData: setAdmins,
		totalPages,
		queryParams,
		handleOnOrder,
		handleOnSelect,
		handleOnPageChange,
		handleOnChangeSearch,
	} = useAsyncLocation({
		fetchFnc: adminApi.getAll,
	});

	const Genders = useGenders(languageId);
	const Positions = usePositions(languageId);

	const [statusCreateModal, toggleCreateModal] = useToggle();
	const [statusProfileModal, toggleProfile] = useToggle();
	const [statusConfirmModal, toggleConfirmDeletionModal] = useToggle();

	const openProfileModal = compose(updateAdminIndex, toggleProfile);
	const openConfirmModal = compose(updateAdminIndex, toggleConfirmDeletionModal);

	const handleCreateAdmin = tryCatch(async (newAdmin) => {
		const { message } = await adminApi.createOne(newAdmin);
		toast.success(message[languageId]);
		toggleCreateModal();
	}, languageId);

	const handleConfirmDeletion = tryCatch(async () => {
		const { message } = await adminApi.deleteOne(Admins[adminIndexRef.current].id);
		toast.success(message[languageId]);
		toggleConfirmDeletionModal();
		setAdmins(
			produce((draft) => {
				draft.splice(adminIndexRef.current, 1);
			}),
		);
	}, languageId);

	const handleUpdateAdmin = tryCatch(async (admin) => {
		const { message } = await adminApi.updateOne(admin);
		toast.success(message[languageId]);
		toggleProfile();
		setAdmins(
			produce((draft) => {
				draft[adminIndexRef.current] = { ...admin };
			}),
		);
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
								initialValue={queryParams.search}
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
								<SortableTableHeader
									orders={queryParams.order}
									name='first_name'
									intl='form.first_name'
									onChange={handleOnOrder}
								/>
								<SortableTableHeader
									orders={queryParams.order}
									name='last_name'
									intl='form.last_name'
									onChange={handleOnOrder}
								/>
								<SortableTableHeader
									orders={queryParams.order}
									name='email'
									intl='form.email'
									onChange={handleOnOrder}
								/>
								<th className='text-start'>
									<FormattedMessage id='form.phone' />
								</th>
								<th className='text-center'>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody>
								{Admins.map(({ id, first_name, last_name, email, phone }, index) => (
									<tr key={id}>
										<td className='text-center'>{index + 1}</td>
										<td className='text-start'>{first_name}</td>
										<td className='text-start'>{last_name}</td>
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
						per_page={queryParams.per_page}
						totalPages={totalPages}
						handleOnSelect={handleOnSelect}
						handleOnPageChange={handleOnPageChange}
					/>
				</div>
			</Container>

			<AdminCreateModal
				isOpen={statusCreateModal}
				genders={Genders}
				positions={Positions}
				onClose={toggleCreateModal}
				onSubmit={handleCreateAdmin}
			/>

			<AdminEditModal
				isOpen={statusProfileModal}
				defaultValues={Admins[adminIndexRef.current]}
				genders={Genders}
				positions={Positions}
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
