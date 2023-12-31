import { linkApi } from 'api';
import {
	Button,
	ConfirmModal,
	Container,
	Divider,
	FormattedDescription,
	SortableTree,
	WrapScrollBar,
} from 'components';
import { flattenTree } from 'components/AdvanceUI/Tree/utils';
import { useToggle, useAuth } from 'hooks';
import { showToastMessage, tryCatch, tryCatchAndToast } from 'utils';
import produce from 'immer';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { LinkModal } from '../../components';

export default function FooterManager() {
	const {
		info: { languageId },
	} = useAuth();

	const focusedLink = useRef({});
	const titleIntl = `dashboard.modules.footer.modal.${focusedLink.current?.id ? 'update' : 'create'}.title`;
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

	const handleCreate = tryCatchAndToast(async (data) => {
		const { message, metadata } = await linkApi.createOne({ ...data, index: links.length, type: 'footer' });
		setLinks(
			produce((draft) => {
				draft.push(metadata);
			}),
		);
		showToastMessage(message, languageId);
		toggleModal();
	}, languageId);

	const handleUpdate = tryCatchAndToast(async (data) => {
		const { id, ...updateBody } = data;
		const { message, metadata } = await linkApi.updateOneById(id, {
			...updateBody,
			type: 'footer',
		});
		if (metadata.length) {
			setLinks(metadata);
		}
		showToastMessage(message, languageId);
		toggleModal();
		focusedLink.current = null;
	}, languageId);

	const handleDeletion = tryCatchAndToast(async () => {
		const listId = flattenTree([focusedLink.current]).map(({ id }) => id);
		const { message, metadata } = await linkApi.deleteByIds({
			listId,
			type: 'footer',
		});
		setLinks(metadata);
		showToastMessage(message, languageId);
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
					<Divider />
					<div className='d-flex justify-content-center gap-2 pt-3'>
						<Button size='sm' info onClick={toggleSortingModal}>
							<FormattedMessage id='button.sort' />
						</Button>
						<Button size='sm' onClick={toggleLinkModal}>
							<FormattedMessage id='button.add' />
						</Button>
					</div>
				</div>
			</Container>

			<ConfirmModal
				idTitleIntl='dashboard.modules.footer.modal.sort.title'
				isOpen={isOpenSortingModal}
				onClose={toggleSortingModal}
				onSubmit={handleOnSorting}
			>
				<FormattedMessage id='dashboard.modules.footer.modal.sort.description' />
			</ConfirmModal>

			<ConfirmModal
				idTitleIntl='dashboard.modules.footer.modal.deletion.title'
				isOpen={isOpenConfirm}
				onClose={toggleConfirmModal}
				onSubmit={handleDeletion}
			>
				<FormattedDescription
					id='dashboard.modules.footer.modal.deletion.description'
					values={{ title: focusedLink.current?.name?.[languageId] || '' }}
				/>
			</ConfirmModal>

			<LinkModal
				titleIntl={titleIntl}
				linkId={focusedLink.current?.id}
				isOpen={isOpenModal}
				onClose={toggleModal}
				onUpdate={handleUpdate}
				onCreate={handleCreate}
			/>
		</>
	);
}
