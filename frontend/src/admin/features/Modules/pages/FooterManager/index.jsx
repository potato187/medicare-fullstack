import { linkApi } from 'admin/api';
import { Button, ConfirmModal, Container, FormattedDescription, SortableTree, WrapScrollBar } from 'admin/components';
import { flattenTree } from 'admin/components/AdvanceUI/Tree/utilities';
import { useToggle } from 'admin/hooks';
import { showToastMessage, tryCatch, tryCatchAndToast } from 'admin/utilities';
import { useAuth } from 'hooks';
import produce from 'immer';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { LinkModal } from '../../components';

export default function FooterManager() {
	const {
		info: { languageId },
	} = useAuth();

	const focusedLink = useRef({});
	const titleIntl = `dashboard.modules.footer.modal.${focusedLink.current?.id ? 'update' : 'create'}_modal.title`;
	const [links, setLinks] = useState([]);

	const [isOpenModal, toggleModal] = useToggle();
	const [isOpenConfirm, toggleConfirmModal] = useToggle();
	const [isOpenSortingModal, toggleSortingModal] = useToggle();

	const toggleLinkModal = (linkData = null) => {
		focusedLink.current = linkData;
		toggleModal();
	};

	const handleToggleConfirmModal = (linkData = null) => {
		focusedLink.current = linkData;
		toggleConfirmModal();
	};

	const handleOnCreate = tryCatchAndToast(async (data) => {
		const { message, metadata } = await linkApi.createOne({ ...data, index: links.length, type: 'footer' });
		setLinks(
			produce((draft) => {
				draft.push(metadata);
			}),
		);
		showToastMessage(message, languageId);
		toggleModal();
	}, languageId);

	const handleOnUpdate = tryCatchAndToast(async (data) => {
		const { id, ...updateBody } = data;

		if (Object.keys(updateBody).length) {
			const { message, metadata } = await linkApi.updateOneById(id, {
				...updateBody,
				type: 'footer',
			});
			setLinks(metadata);
			focusedLink.current = null;
			showToastMessage(message, languageId);
		}
		toggleModal();
	}, languageId);

	const handleOnSubmitDeletion = tryCatchAndToast(async () => {
		const listId = flattenTree([focusedLink.current]).map(({ id }) => id);
		if (listId.length) {
			const { message, metadata } = await linkApi.deleteByIds({
				listId,
				type: 'footer',
			});
			setLinks(metadata);
			showToastMessage(message, languageId);
		}
		toggleConfirmModal();
	}, languageId);

	const handleOnSorting = tryCatchAndToast(async () => {
		const flattenedLinks = flattenTree(links).map(({ id, index, parentId }) => ({
			id,
			index,
			parentId,
		}));
		const { message } = await linkApi.sortable(flattenedLinks);
		showToastMessage(message, languageId);
		toggleSortingModal();
	}, languageId);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await linkApi.getAll({
				type: 'footer',
			});
			setLinks(metadata);
		})();
	}, []);

	return (
		<>
			<Container id='page-main'>
				<div className='d-flex flex-column h-100 py-5'>
					<WrapScrollBar>
						<SortableTree
							collapsible
							removable
							items={links}
							languageId={languageId}
							setItems={setLinks}
							handleConfirmDeletion={handleToggleConfirmModal}
							handleModifyItem={toggleLinkModal}
						/>
					</WrapScrollBar>
					<div className='d-flex justify-content-center gap-2 pt-4 border-top border-gray-300'>
						<Button size='sm' info onClick={toggleSortingModal}>
							<FormattedMessage id='dashboard.modules.footer.modal.button_sort' />
						</Button>
						<Button size='sm' onClick={toggleLinkModal}>
							<FormattedMessage id='dashboard.modules.footer.modal.button_add' />
						</Button>
					</div>
				</div>
			</Container>

			<ConfirmModal
				idTitleIntl='dashboard.modules.footer.modal.sort_modal.title'
				isOpen={isOpenSortingModal}
				onClose={toggleSortingModal}
				onSubmit={handleOnSorting}
			>
				<FormattedMessage id='dashboard.modules.footer.modal.sort_modal.description' />
			</ConfirmModal>

			<ConfirmModal
				idTitleIntl='dashboard.modules.footer.modal.deletion_modal.title'
				isOpen={isOpenConfirm}
				onClose={toggleConfirmModal}
				onSubmit={handleOnSubmitDeletion}
			>
				<FormattedDescription
					id='dashboard.modules.footer.modal.deletion_modal.description'
					values={{ title: focusedLink?.name?.[languageId] || '' }}
				/>
			</ConfirmModal>

			<LinkModal
				titleIntl={titleIntl}
				linkId={focusedLink.current?.id}
				isOpen={isOpenModal}
				onClose={toggleModal}
				onUpdate={handleOnUpdate}
				onCreate={handleOnCreate}
			/>
		</>
	);
}
