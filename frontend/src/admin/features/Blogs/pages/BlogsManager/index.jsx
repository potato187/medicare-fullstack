import { blogApi, blogCategoryApi } from 'admin/api';
import {
	Button,
	ConfirmModal,
	Container,
	DropdownTree,
	FooterContainer,
	FormattedDescription,
	SortableTableHeader,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
	UnFieldDebounce,
	UnFieldSwitch,
} from 'admin/components';
import { useAsyncLocation, useCurrentIndex, useToggle } from 'admin/hooks';
import { compose, showToastMessage, tryCatch, tryCatchAndToast } from 'admin/utilities';
import { useAuth } from 'hooks';
import produce from 'immer';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { formatDate } from 'utils';

const DEFAULT_OPTION = {
	value: 'all',
	label: {
		en: 'All Categories',
		vi: 'Tất cả danh mục',
	},
	index: -1,
	name: 'blogs-categories',
};

export function BlogsManager() {
	const {
		info: { languageId },
	} = useAuth();
	const { currentIndexRef: blogIndexRef, setCurrentIndex: updateBlogIndexRef } = useCurrentIndex();

	const [blogCategories, setBlogCategories] = useState([DEFAULT_OPTION]);
	const {
		data: Blogs,
		queryParams,
		totalPages,
		setData: updateBlogs,
		setQueryParams,
		handleOnPageChange,
		handleOnSelect,
		handleOnChangeSearch,
	} = useAsyncLocation({
		getData: blogApi.getByQueryParams,
		parameters: {
			categoryId: 'all',
		},
	});
	const [isOpenConfirmModal, toggleConfirmModal] = useToggle();

	const openConfirmModal = compose(updateBlogIndexRef, toggleConfirmModal);

	const handleSelectCategory = (categoryId) => {
		setQueryParams({ categoryId });
	};

	const handleToggleDisplayBlog = tryCatchAndToast(async (data) => {
		const { id, isDisplay, index } = data;
		const { message } = await blogApi.updateOneById(id, { isDisplay });
		updateBlogs(
			produce((draft) => {
				draft[index].isDisplay = isDisplay;
			}),
		);
		showToastMessage(message, languageId);
	}, languageId);

	const handleDeleteBlog = tryCatchAndToast(async () => {
		const index = blogIndexRef.current;
		const { message } = await blogApi.deleteOneById(Blogs[index].id);
		updateBlogs(
			produce((draft) => {
				draft.splice(index, 1);
			}),
		);
		updateBlogIndexRef(-1);
		showToastMessage(message, languageId);
		toggleConfirmModal();
	}, languageId);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await blogCategoryApi.getFlattenAll();
			if (metadata && metadata.length) {
				const formattedData = metadata.map(({ _id, index, name }) => ({
					value: _id,
					index,
					label: { ...name },
					name: 'blogs-categories',
				}));
				setBlogCategories([DEFAULT_OPTION, ...formattedData]);
			}
		})();
	}, []);

	return (
		<>
			<Container id='page-main'>
				<div className='d-flex flex-column h-100 py-5'>
					<div className='d-flex pb-4'>
						<div className='d-flex items-end gap-2'>
							<DropdownTree
								size='md'
								languageId={languageId}
								nameGroup='post-categories'
								value={queryParams?.categoryId}
								options={blogCategories}
								onChange={handleSelectCategory}
							/>
							<UnFieldDebounce
								delay={500}
								type='text'
								placeholderIntl='form.search_placeholder'
								ariallabel='search field'
								id='form-search'
								onChange={handleOnChangeSearch}
							/>
						</div>
					</div>
					<TableGrid className='scrollbar'>
						<Table hover striped auto>
							<TableHeader>
								<th className='text-center'>
									<FormattedMessage id='table.no' />
								</th>
								<SortableTableHeader className='text-start' name={`title.${languageId}`} intl='common.title' />
								<SortableTableHeader className='text-center' name='datePublished' intl='common.public_date' />
								<SortableTableHeader className='text-center' name='isDisplay' intl='form.display' />
								<th className='text-center'>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody>
								{Blogs.map(({ id, title, datePublished, isDisplay }, index) => (
									<tr key={id}>
										<td className='text-center'>{index + 1}</td>
										<td className='text-truncate'>{title[languageId]}</td>
										<td className='text-center'>{formatDate(datePublished)}</td>
										<td className='text-center'>
											<UnFieldSwitch
												name={id}
												checked={+isDisplay === 1}
												onChange={(event) => {
													handleToggleDisplayBlog({ id, isDisplay: event.target.checked, index });
												}}
											/>
										</td>
										<td>
											<div className='d-flex justify-content-center gap-2'>
												<Button success size='xs' info>
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
						pagesize={queryParams.pagesize || 25}
						totalPages={totalPages}
						currentPage={+queryParams.page - 1}
						handleOnPageChange={handleOnPageChange}
						handleOnSelect={handleOnSelect}
					/>
				</div>
			</Container>
			<ConfirmModal
				idTitleIntl='dashboard.blogs.modal.blog_deletion_confirmation_modal.title'
				isOpen={isOpenConfirmModal}
				onClose={toggleConfirmModal}
				onSubmit={handleDeleteBlog}
			>
				<FormattedDescription
					id='dashboard.blogs.modal.blog_deletion_confirmation_modal.description'
					values={{ title: Blogs?.[blogIndexRef.current]?.title[languageId] || '' }}
				/>
			</ConfirmModal>
		</>
	);
}
