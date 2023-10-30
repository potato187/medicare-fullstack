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
import { useAuth, useToggle } from 'hooks';
import produce from 'immer';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { showToastMessage, tryCatch, tryCatchAndToast } from 'utils';
import { LinkModal } from '../../components';

export default function HeaderManager() {
	const {
		info: { languageId },
	} = useAuth();

	const focusedLink = useRef({});
	const titleIntl = `dashboard.modules.header.modal.${focusedLink.current?.id ? 'update' : 'create'}.title`;
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
		const { message, metadata } = await linkApi.createOne({ ...data, index: links.length, type: 'header' });
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
				type: 'header',
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
				type: 'header',
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
				type: 'header',
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
					<div className='d-flex justify-content-center gap-2 pt-4'>
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
				idTitleIntl='dashboard.modules.header.modal.sort.title'
				isOpen={isOpenSortingModal}
				onClose={toggleSortingModal}
				onSubmit={handleOnSorting}
			>
				<FormattedMessage id='dashboard.modules.header.modal.sort.description' />
			</ConfirmModal>

			<ConfirmModal
				idTitleIntl='dashboard.modules.header.modal.deletion.title'
				isOpen={isOpenConfirm}
				onClose={toggleConfirmModal}
				onSubmit={handleOnSubmitDeletion}
			>
				<FormattedDescription
					id='dashboard.modules.header.modal.deletion.description'
					values={{ title: focusedLink.current?.name?.[languageId] || '' }}
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
