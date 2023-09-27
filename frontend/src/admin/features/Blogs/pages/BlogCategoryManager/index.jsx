import { blogCategoryApi } from 'admin/api';
import { Button, ConfirmModal, Container, FormattedDescription, SortableTree, WrapScrollBar } from 'admin/components';
import { flattenTree, removeItem } from 'admin/components/AdvanceUI/Tree/utilities';
import { useToggle } from 'admin/hooks';
import { compose, getObjectDiff, showToastMessage, tryCatch, tryCatchAndToast } from 'admin/utilities';
import { useAuth } from 'hooks';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { BlogCategoryModal } from '../../components';

export function BlogCategoryManager() {
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
	const openDeletionModal = compose(handleSelectCategory, toggleDeletionModal);

	const handleOnCreate = tryCatchAndToast(async (data) => {
		const { metadata, message } = await blogCategoryApi.createOne({ ...data, index: blogCategories.length });
		setBlogCategories((blogCategories) => {
			const { _id, ...rest } = metadata;
			const newBlogCategory = { id: _id, ...rest, parentId: null, children: [], depth: 0, collapsed: null };
			return [...blogCategories, newBlogCategory];
		});
		showToastMessage(message, languageId);
		handleToggleModal();
	}, languageId);

	const handleOnSort = tryCatchAndToast(async () => {
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
		setBlogCategories((blogCategories) => {
			return removeItem(blogCategories, listId[0].id);
		});

		showToastMessage(message, languageId);
		toggleDeletionModal();
	}, languageId);

	const handleOnUpdate = tryCatchAndToast(async (data) => {
		const body = getObjectDiff(focusedCategory.current, data);
		const { metadata, message } = await blogCategoryApi.updateOneById(focusedCategory.current.id, body);
		if (metadata) {
			setBlogCategories(metadata);
			focusedCategory.current = null;
		}
		showToastMessage(message, languageId);
		toggleModal();
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
							handleConfirmDeletion={openDeletionModal}
							handleModifyItem={handleToggleModal}
						/>
					</WrapScrollBar>
					<div className='d-flex justify-content-center gap-2 pt-4 border-top border-gray-300'>
						<Button size='sm' info onClick={toggleSortableModal}>
							<FormattedMessage id='dashboard.blogs.modal.button_sort' />
						</Button>
						<Button size='sm' onClick={() => handleToggleModal()}>
							<FormattedMessage id='dashboard.blogs.modal.button_add' />
						</Button>
					</div>
				</div>
			</Container>
			<ConfirmModal
				idTitleIntl='dashboard.blogs.modal.sort_categories_confirmation_modal.title'
				isOpen={isOpenSortModal}
				onClose={toggleSortableModal}
				onSubmit={handleOnSort}
			>
				<FormattedMessage id='dashboard.blogs.modal.sort_categories_confirmation_modal.description' />
			</ConfirmModal>

			<ConfirmModal
				idTitleIntl='dashboard.blogs.modal.category_deletion_confirmation_modal.title'
				isOpen={isOpenDeletionModal}
				onClose={toggleDeletionModal}
				onSubmit={handleConfirmDeletion}
			>
				<FormattedDescription
					id='dashboard.blogs.modal.category_deletion_confirmation_modal.description'
					values={{ title: focusedCategory.current?.name?.[languageId] || '' }}
				/>
			</ConfirmModal>

			<BlogCategoryModal
				blogCategory={focusedCategory.current}
				isOpen={statusModal}
				toggle={toggleModal}
				onCreate={handleOnCreate}
				onUpdate={handleOnUpdate}
			/>
		</>
	);
}
