import { blogCategoryApi } from 'admin/api';
import { Button, ConfirmModal, Container, FormattedDescription, SortableTree, WrapScrollBar } from 'admin/components';
import { flattenTree, removeItem } from 'admin/components/AdvanceUI/Tree/utilities';
import { useToggle } from 'admin/hooks';
import { compose, findPathFromRoot, showToastMessage, tryCatchAndToast } from 'admin/utilities';
import { useAuth } from 'hooks';
import produce from 'immer';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CreateBlogCategoryModal, UpdateBlogCategoryModal } from '../../components';
import { useFetchBlogCategories } from '../../hooks/useFetchBlogCategories';

export function BlogCategoryManager() {
	const {
		info: { languageId },
	} = useAuth();

	const [blogCategories, setBlogCategories] = useFetchBlogCategories();
	const [isOpenCreateModal, toggleCreateModal] = useToggle();
	const [isOpenUpdateModal, toggleUpdateModal] = useToggle();
	const [isOpenSortModal, toggleSortableModal] = useToggle();
	const [isOpenDeletionModal, toggleDeletionModal] = useToggle();

	const [focusedCategory, setFocusCategory] = useState(null);

	const handleSelectCategory = (category) => {
		if (!focusedCategory || category.id !== focusedCategory.id) {
			setFocusCategory({ ...category });
		}
	};
	const openUpdateModal = compose(handleSelectCategory, toggleUpdateModal);
	const openDeletionModal = compose(handleSelectCategory, toggleDeletionModal);

	const handleCreateBlogCategory = tryCatchAndToast(async (data) => {
		const { metadata, message } = await blogCategoryApi.createOne({ ...data, index: blogCategories.length });
		setBlogCategories((blogCategories) => {
			const { _id, ...rest } = metadata;
			const newBlogCategory = { id: _id, ...rest, parentId: null, children: [], depth: 0, collapsed: null };
			return [...blogCategories, newBlogCategory];
		});
		showToastMessage(message, languageId);
		toggleCreateModal();
	}, languageId);

	const handleSortBlogCategories = tryCatchAndToast(async () => {
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
		const listId = flattenTree([focusedCategory]).map(({ id }) => ({ id }));
		const { message } = await blogCategoryApi.deleteByIds(listId);

		setBlogCategories((blogCategories) => {
			return removeItem(blogCategories, listId[0].id);
		});

		showToastMessage(message, languageId);
		toggleDeletionModal();
	}, languageId);

	const handleUpdateBlogCategory = tryCatchAndToast(async (updateBody) => {
		const { metadata, message } = await blogCategoryApi.updateOneById(focusedCategory.id, updateBody);
		if (Object.keys(metadata).length) {
			setBlogCategories(
				produce((draft) => {
					const path = findPathFromRoot(draft, focusedCategory.id);
					let blogCategory = null;

					while (path.length > 0) {
						const index = path.shift();
						blogCategory = !blogCategory ? draft[index] : blogCategory.children[index];
					}

					Object.entries(metadata).forEach(([key, value]) => {
						blogCategory[key] = value;
					});
				}),
			);
		}

		showToastMessage(message, languageId);
		toggleUpdateModal();
	}, languageId);

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
							handleModifyItem={openUpdateModal}
						/>
					</WrapScrollBar>
					<div className='d-flex justify-content-center gap-2 pt-4 border-top border-gray-300'>
						<Button size='sm' info onClick={toggleSortableModal}>
							<FormattedMessage id='dashboard.blogs.modal.button_sort' />
						</Button>
						<Button size='sm' onClick={toggleCreateModal}>
							<FormattedMessage id='dashboard.blogs.modal.button_add' />
						</Button>
					</div>
				</div>
			</Container>
			<ConfirmModal
				idTitleIntl='dashboard.blogs.modal.sort_categories_confirmation_modal.title'
				isOpen={isOpenSortModal}
				onClose={toggleSortableModal}
				onSubmit={handleSortBlogCategories}
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
					values={{ title: focusedCategory?.name?.[languageId] || '' }}
				/>
			</ConfirmModal>

			<UpdateBlogCategoryModal
				blogCategory={focusedCategory}
				isOpen={isOpenUpdateModal}
				toggle={toggleUpdateModal}
				onSubmit={handleUpdateBlogCategory}
			/>

			<CreateBlogCategoryModal
				isOpen={isOpenCreateModal}
				toggle={toggleCreateModal}
				onSubmit={handleCreateBlogCategory}
			/>
		</>
	);
}
