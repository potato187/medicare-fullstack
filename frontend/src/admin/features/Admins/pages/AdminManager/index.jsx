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

	console.log(languageId);

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

	/* 	const Genders = useGenders(languageId);
	const Positions = usePositions(languageId);
 */

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

	return <React.Fragment></React.Fragment>;
}
