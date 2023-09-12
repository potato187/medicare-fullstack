import { postCategoryApi } from 'admin/api';
import produce from 'immer';
import { Button, ConfirmModal, Container, FormattedDescription, SortableTree, WrapScrollBar } from 'admin/components';
import { flattenTree, removeItem } from 'admin/components/AdvanceUI/Tree/utilities';
import { useToggle } from 'admin/hooks';
import { compose, findPathFromRoot, showToastMessage, tryCatch, tryCatchAndToast } from 'admin/utilities';
import { useAuth } from 'hooks';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CreatePostCategoryModal, UpdatePostCategoryModal } from '../../components';

export function CategoryManager() {
	const {
		info: { languageId },
	} = useAuth();

	const [postCategories, setPostCategories] = useState([]);
	const [isOpenCreateModal, toggleCreateModal] = useToggle();
	const [isOpenUpdateModal, toggleUpdateModal] = useToggle();
	const [isOpenSortModal, toggleSortableModal] = useToggle();
	const [isOpenDeletionModal, toggleDeletionModal] = useToggle();

	const [focusedPostCategory, setFocusedPostCategory] = useState(null);

	const handleSelectCategory = (category) => {
		if (!focusedPostCategory || category.id !== focusedPostCategory.id) {
			setFocusedPostCategory({ ...category });
		}
	};
	const openUpdateModal = compose(handleSelectCategory, toggleUpdateModal);
	const openDeletionModal = compose(handleSelectCategory, toggleDeletionModal);

	const handleCreatePostCategory = tryCatchAndToast(async (data) => {
		const { metadata, message } = await postCategoryApi.createOne({ ...data, index: postCategories.length });
		setPostCategories((postCategories) => {
			const { _id, ...rest } = metadata;
			const newPostCategory = { id: _id, ...rest, parentId: null, children: [], depth: 0, collapsed: null };
			return [...postCategories, newPostCategory];
		});
		showToastMessage(message, languageId);
		toggleCreateModal();
	}, languageId);

	const handleSortPostCategories = tryCatchAndToast(async () => {
		const flattenedCategories = flattenTree(postCategories).map(({ id, index, parentId }) => ({
			id,
			index,
			parentId,
		}));
		const { message } = await postCategoryApi.sortable(flattenedCategories);
		showToastMessage(message, languageId);
		toggleSortableModal();
	}, languageId);

	const handleConfirmDeletion = tryCatchAndToast(async () => {
		const listIdPostCategory = flattenTree([focusedPostCategory]).map(({ id }) => ({ id }));
		const { message } = await postCategoryApi.deleteByIds(listIdPostCategory);

		console.log(listIdPostCategory);

		setPostCategories((postCategories) => {
			return removeItem(postCategories, listIdPostCategory[0].id);
		});

		showToastMessage(message, languageId);
		toggleDeletionModal();
	}, languageId);

	const handleUpdatePostCategory = tryCatchAndToast(async (updateBody) => {
		const { metadata, message } = await postCategoryApi.updateOneById(focusedPostCategory.id, updateBody);
		if (Object.keys(metadata).length) {
			setPostCategories(
				produce((draft) => {
					const path = findPathFromRoot(draft, focusedPostCategory.id);
					let postCategory = null;

					while (path.length > 0) {
						const index = path.shift();
						postCategory = !postCategory ? draft[index] : postCategory.children[index];
					}

					Object.entries(metadata).forEach(([key, value]) => {
						postCategory[key] = value;
					});
				}),
			);
		}

		showToastMessage(message, languageId);
		toggleUpdateModal();
	}, languageId);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await postCategoryApi.getAll();
			setPostCategories(metadata);
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
							items={postCategories}
							languageId={languageId}
							setItems={setPostCategories}
							handleConfirmDeletion={openDeletionModal}
							handleModifyItem={openUpdateModal}
						/>
					</WrapScrollBar>
					<div className='d-flex justify-content-center gap-2 pt-4 border-top border-gray-300'>
						<Button size='sm' info onClick={toggleSortableModal}>
							<FormattedMessage id='dashboard.posts.modal.button_sort' />
						</Button>
						<Button size='sm' onClick={toggleCreateModal}>
							<FormattedMessage id='dashboard.posts.modal.button_add' />
						</Button>
					</div>
				</div>
			</Container>
			<ConfirmModal
				idTitleIntl='dashboard.posts.modal.sort_categories_confirmation_modal.title'
				isOpen={isOpenSortModal}
				onClose={toggleSortableModal}
				onSubmit={handleSortPostCategories}
			>
				<FormattedMessage id='dashboard.posts.modal.sort_categories_confirmation_modal.description' />
			</ConfirmModal>

			<ConfirmModal
				idTitleIntl='dashboard.posts.modal.category_deletion_confirmation_modal.title'
				isOpen={isOpenDeletionModal}
				onClose={toggleDeletionModal}
				onSubmit={handleConfirmDeletion}
			>
				<FormattedDescription
					id='dashboard.posts.modal.category_deletion_confirmation_modal.description'
					values={{ title: focusedPostCategory?.name?.[languageId] || '' }}
				/>
			</ConfirmModal>
			<UpdatePostCategoryModal
				postCategory={focusedPostCategory}
				isOpen={isOpenUpdateModal}
				toggle={toggleUpdateModal}
				onSubmit={handleUpdatePostCategory}
			/>

			<CreatePostCategoryModal
				isOpen={isOpenCreateModal}
				toggle={toggleCreateModal}
				onSubmit={handleCreatePostCategory}
			/>
		</>
	);
}
