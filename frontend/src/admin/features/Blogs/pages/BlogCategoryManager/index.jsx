import { blogCategoryApi } from 'api';
import {
	Button,
	ConfirmModal,
	Container,
	Divider,
	FormattedDescription,
	SortableTree,
	WrapScrollBar,
} from 'components';
import { flattenTree, removeItem } from 'components/AdvanceUI/Tree/utils';
import { useAuth, useToggle } from 'hooks';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { compose, getObjectDiff, showToastMessage, tryCatch, tryCatchAndToast } from 'utils';
import { BlogCategoryModal } from '../../components';

export default function BlogCategoryManager() {
	const {
		info: { languageId },
	} = useAuth();
	const focusedCategory = useRef(null);
	const [blogCategories, setBlogCategories] = useState([]);
	const [statusModal, toggleModal] = useToggle();
	const [isOpenSortModal, toggleSortableModal] = useToggle();
	const [isOpenDeletionModal, toggleDeletionModal] = useToggle();

	const handleSelectCategory = (category = null) => {
		focusedCategory.current = category;
	};

	const handleToggleModal = compose(handleSelectCategory, toggleModal);
	const handleToggleDeletionModal = compose(handleSelectCategory, toggleDeletionModal);

	const handleCreate = tryCatchAndToast(async (data) => {
		const { metadata, message } = await blogCategoryApi.createOne({ ...data, index: blogCategories.length });
		setBlogCategories((blogCategories) => {
			const { _id, ...rest } = metadata;
			const newBlogCategory = { id: _id, ...rest, parentId: null, children: [], depth: 0, collapsed: null };
			return [...blogCategories, newBlogCategory];
		});
		showToastMessage(message, languageId);
		handleToggleModal();
	}, languageId);

	const handleSort = tryCatchAndToast(async () => {
		const flattenedCategories = flattenTree(blogCategories).map(({ id, index, parentId }) => ({
			id,
			index,
			parentId,
		}));
		const { message } = await blogCategoryApi.sortable(flattenedCategories);
		showToastMessage(message, languageId);
		toggleSortableModal();
	}, languageId);

	const handleConfirmDeletion = tryCatchAndToast(async () => {
		const listId = flattenTree([focusedCategory.current]).map(({ id }) => ({ id }));
		const { message } = await blogCategoryApi.deleteByIds(listId);
		setBlogCategories((blogCategories) => removeItem(blogCategories, listId[0].id));
		showToastMessage(message, languageId);
		handleToggleDeletionModal(null);
	}, languageId);

	const handleUpdate = tryCatchAndToast(async (data) => {
		const body = getObjectDiff(focusedCategory.current, data);
		const { metadata, message } = await blogCategoryApi.updateOneById(focusedCategory.current.id, body);
		if (metadata) {
			setBlogCategories(metadata);
			focusedCategory.current = null;
		}
		showToastMessage(message, languageId);
		handleToggleModal();
	}, languageId);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await blogCategoryApi.getAll();
			setBlogCategories(metadata);
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
							items={blogCategories}
							languageId={languageId}
							setItems={setBlogCategories}
							handleConfirmDeletion={handleToggleDeletionModal}
							handleModifyItem={handleToggleModal}
						/>
					</WrapScrollBar>
					<Divider />
					<div className='d-flex justify-content-center gap-2 pt-3 '>
						<Button size='sm' info onClick={toggleSortableModal}>
							<FormattedMessage id='button.sort' />
						</Button>
						<Button size='sm' onClick={() => handleToggleModal()}>
							<FormattedMessage id='button.add' />
						</Button>
					</div>
				</div>
			</Container>

			<ConfirmModal
				idTitleIntl='dashboard.blogs.modal.sort.title'
				isOpen={isOpenSortModal}
				onClose={toggleSortableModal}
				onSubmit={handleSort}
			>
				<FormattedMessage id='dashboard.blogs.modal.sort.description' />
			</ConfirmModal>

			<ConfirmModal
				idTitleIntl='dashboard.blogs.modal.category.deletion.title'
				isOpen={isOpenDeletionModal}
				onClose={toggleDeletionModal}
				onSubmit={handleConfirmDeletion}
			>
				<FormattedDescription
					id='dashboard.blogs.modal.category.deletion.description'
					values={{ title: focusedCategory.current?.name?.[languageId] || '' }}
				/>
			</ConfirmModal>

			<BlogCategoryModal
				blogCategory={focusedCategory.current}
				isOpen={statusModal}
				toggle={toggleModal}
				onCreate={handleCreate}
				onUpdate={handleUpdate}
			/>
		</>
	);
}
