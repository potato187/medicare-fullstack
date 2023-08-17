import { postCategoryApi } from '@/admin/api';
import { Button, ConfirmModal, Container, SortableTree, WrapScrollBar } from '@/admin/components';
import { flattenTree, removeItem } from '@/admin/components/AdvanceUI/Tree/utilities';
import { useToggle } from '@/admin/hooks';
import { compose, findPathFromRoot } from '@/admin/utilities';
import { useAuth } from '@/hooks';
import { FormattedDescription } from '@/shared/components';
import { tryCatch } from '@/shared/utils';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { AddCategoryModal, ModifyCategoryModal } from '../../components';

export function CategoryManager() {
	const { languageId } = useAuth();
	const [categories, setCategories] = useState([]);
	const localizedTitle = `title_${languageId}`;

	const [focusedCategory, setFocusedCategory] = useState({});

	const [statusAddModal, toggleAddModal] = useToggle();
	const [statusModifyModal, toggleModifyModal] = useToggle();
	const [statusDeletionModal, toggleDeletionModal] = useToggle();
	const [statusSortModal, toggleSortModal] = useToggle();

	const handleSelectCategory = (category) => {
		if (!focusedCategory || category.id !== focusedCategory.id) {
			setFocusedCategory({ ...category });
		}
	};

	const openModifyModal = compose(handleSelectCategory, toggleModifyModal);
	const openDeletionModal = compose(handleSelectCategory, toggleDeletionModal);

	const submitAddCategory = async (newCategory) => {
		try {
			newCategory.index = categories.length;
			const { data: dataResponse, message } = await postCategoryApi.createOne(newCategory);
			setCategories((prevCategories) => [...prevCategories, { ...newCategory, ...dataResponse }]);
			toast.success(message[languageId]);
			toggleAddModal();
		} catch (error) {
			toast.error(error.message[languageId]);
		}
	};

	const submitUpdateCategory = async (data) => {
		try {
			const { data: response, message } = await postCategoryApi.updateOne(data);

			setCategories((prevCategories) => {
				const path = findPathFromRoot(prevCategories, data.id);
				let category = null;

				while (path.length > 0) {
					const index = path.shift();
					category = !category ? prevCategories[index] : category.children[index];
				}

				Object.assign(category, response);

				return [...prevCategories];
			});

			toggleModifyModal();
			toast.success(message[languageId]);
		} catch (error) {
			toast.error(error.message[languageId]);
		}
	};

	const submitConfirmDeletionCategory = async () => {
		try {
			const deletionData = flattenTree([focusedCategory]).map(({ id }) => ({ id }));
			const { message } = await postCategoryApi.deleteByIds(deletionData);
			setCategories((categories) => removeItem(categories, deletionData[0].id));
			toast.success(message[languageId]);
			toggleDeletionModal();
		} catch (error) {
			toast.error(error.message[languageId]);
		}
	};

	const confirmSortCategories = async () => {
		try {
			const flattenedCategories = flattenTree(categories).map(({ id, index, parentId }) => ({ id, index, parentId }));
			const { message } = await postCategoryApi.sortCategories(flattenedCategories);
			toast.success(message[languageId]);
			toggleSortModal();
		} catch (error) {
			toast.error(error.message[languageId]);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await postCategoryApi.getAll();
			setCategories(data);
		};
		tryCatch(fetchData)();
	}, []);

	return (
		<React.Fragment>
			<Container id='page-main'>
				<div className='d-flex flex-column h-100 py-5'>
					<WrapScrollBar>
						<SortableTree
							collapsible
							removable
							items={categories}
							setItems={setCategories}
							languageId={languageId}
							handleModifyItem={openModifyModal}
							handleConfirmDeletion={openDeletionModal}
							localizedTitle={localizedTitle}
						/>
					</WrapScrollBar>
					<div className='d-flex justify-content-center gap-2 pt-4 border-top border-gray-300'>
						<Button size='sm' info onClick={toggleSortModal}>
							<FormattedMessage id='dashboard.posts.modal.button_sort' />
						</Button>
						<Button size='sm' onClick={toggleAddModal}>
							<FormattedMessage id='dashboard.posts.modal.button_add' />
						</Button>
					</div>
				</div>
			</Container>
			<AddCategoryModal
				defaultValues={focusedCategory}
				isOpen={statusAddModal}
				toggle={toggleAddModal}
				onSubmit={submitAddCategory}
			/>
			<ModifyCategoryModal
				defaultValues={focusedCategory}
				isOpen={statusModifyModal}
				toggle={toggleModifyModal}
				onSubmit={submitUpdateCategory}
			/>
			<ConfirmModal
				idTitleIntl='dashboard.posts.modal.category_deletion_confirmation_modal.title'
				isOpen={statusDeletionModal}
				onClose={toggleDeletionModal}
				onSubmit={submitConfirmDeletionCategory}>
				<FormattedDescription
					id='dashboard.posts.modal.category_deletion_confirmation_modal.description'
					values={{ title: focusedCategory?.[localizedTitle] ?? '' }}
				/>
			</ConfirmModal>
			<ConfirmModal
				idTitleIntl='dashboard.posts.modal.sort_categories_confirmation_modal.title'
				isOpen={statusSortModal}
				onClose={toggleSortModal}
				onSubmit={confirmSortCategories}>
				<FormattedMessage id='dashboard.posts.modal.sort_categories_confirmation_modal.description' />
			</ConfirmModal>
		</React.Fragment>
	);
}
