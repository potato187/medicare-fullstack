import { blogApi } from 'admin/api';
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
import { useAsyncLocation, useIndex, useToggle } from 'admin/hooks';
import { compose, formatISODate, showToastMessage, tryCatchAndToast } from 'admin/utilities';
import { useAuth } from 'hooks';
import produce from 'immer';
import { useMemo } from 'react';
import { MdAdd } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { formatDate } from 'utils';
import { BlogModal } from '../../components';
import { useFetchBlogCategories } from '../../hooks/useFetchBlogCategories';

const DEFAULT_OPTION = {
	value: 'all',
	label: {
		en: 'All Categories',
		vi: 'Tất cả danh mục',
	},
	index: -1,
	name: 'blog-categories',
};

export default function BlogsManager() {
	const {
		info: { languageId },
	} = useAuth();
	const { index: blogIndex, setIndex: setBlogIndex } = useIndex();

	const [blogCategories] = useFetchBlogCategories();

	const blogCategoryOptions = useMemo(() => {
		const formattedData = blogCategories.map(({ _id, index, name }) => ({
			value: _id,
			index,
			label: { ...name },
			name: 'blog-categories',
		}));

		return [DEFAULT_OPTION, ...formattedData];
	}, [blogCategories]);

	const {
		data: Blogs,
		queryParams,
		totalPages,
		isLoading,
		setData: updateBlogs,
		setQueryParams,
		handlePageChange,
		handleSelect,
		handleChangeSearch,
		handleChangeSort,
	} = useAsyncLocation({
		fetch: blogApi.getByQueryParams,
		parameters: {
			categoryId: 'all',
		},
	});

	const [statusConfirmModal, toggleConfirmModal] = useToggle();
	const [statusModal, toggleEditorModal] = useToggle();

	const handleToggleConfirmModal = compose(setBlogIndex, toggleConfirmModal);
	const handleToggleModal = compose(setBlogIndex, toggleEditorModal);

	const handleSelectCategory = (categoryId) => {
		setQueryParams({ categoryId });
	};

	const handleToggleDisplay = tryCatchAndToast(async (data) => {
		const { id, isDisplay, index } = data;
		const { message } = await blogApi.updateOneById(id, { isDisplay });
		updateBlogs(
			produce((draft) => {
				draft[index].isDisplay = isDisplay;
			}),
		);
		showToastMessage(message, languageId);
	}, languageId);

	const handleDelete = tryCatchAndToast(async () => {
		const index = blogIndex;
		const { message } = await blogApi.deleteOneById(Blogs[index]._id);
		updateBlogs(
			produce((draft) => {
				draft.splice(index, 1);
			}),
		);
		setBlogIndex(-1);
		showToastMessage(message, languageId);
		toggleConfirmModal();
	}, languageId);

	const handleUpdate = tryCatchAndToast(async (data) => {
		const { blogId, ...updateBody } = data;
		const { message, metadata } = await blogApi.updateOneById(blogId, updateBody);

		updateBlogs(
			produce((draft) => {
				const index = blogIndex;
				Object.entries(metadata).forEach(([key, value]) => {
					if (Object.hasOwn(draft[index], key)) {
						draft[index][key] = value;
					}
				});
			}),
		);

		showToastMessage(message, languageId);
		toggleEditorModal();
	}, languageId);

	const handleCreate = tryCatchAndToast(async (data) => {
		const { id, slug, datePublished, ...body } = data;
		const { message, metadata } = await blogApi.createOne({ datePublished: formatISODate(datePublished), ...body });
		if (Blogs.length < queryParams.pagesize) {
			updateBlogs(
				produce((draft) => {
					draft.push(metadata);
				}),
			);
		}
		showToastMessage(message, languageId);
		toggleEditorModal();
	}, languageId);

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
								options={blogCategoryOptions}
								onChange={handleSelectCategory}
							/>
							<UnFieldDebounce
								delay={500}
								type='text'
								placeholderIntl='form.search_placeholder'
								ariallabel='search field'
								id='form-search'
								onChange={handleChangeSearch}
							/>
						</div>
						<div className='px-5 d-flex gap-2 ms-auto'>
							<Button size='sm' onClick={() => handleToggleModal(-1)}>
								<span>
									<FormattedMessage id='dashboard.blogs.modal.button_create_blog' />
								</span>
								<MdAdd size='1.25em' className='ms-2' />
							</Button>
						</div>
					</div>
					<TableGrid className='scrollbar'>
						<Table hover striped auto>
							<TableHeader>
								<th className='text-center'>
									<FormattedMessage id='table.no' />
								</th>
								<SortableTableHeader
									className='text-start'
									name={`title.${languageId}`}
									intl='common.title.default'
									onChange={handleChangeSort}
								/>
								<SortableTableHeader
									className='text-center'
									name='datePublished'
									intl='common.public_date'
									onChange={handleChangeSort}
								/>
								<SortableTableHeader
									className='text-center'
									name='isDisplay'
									intl='form.display'
									onChange={handleChangeSort}
								/>
								<th className='text-center'>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody isLoading={isLoading} list={Blogs} columns={5}>
								{({ _id: id, title, datePublished, isDisplay }, index) => (
									<tr key={id}>
										<td className='text-center'>{index + 1}</td>
										<td className='text-truncate'>{title[languageId]}</td>
										<td className='text-center'>{formatDate(datePublished)}</td>
										<td className='text-center'>
											<UnFieldSwitch
												name={id}
												checked={+isDisplay === 1}
												onChange={(event) => {
													handleToggleDisplay({ id, isDisplay: event.target.checked, index });
												}}
											/>
										</td>
										<td>
											<div className='d-flex justify-content-center gap-2'>
												<Button success size='xs' info onClick={() => handleToggleModal(index)}>
													<FormattedMessage id='button.update' />
												</Button>
												<Button size='xs' danger onClick={() => handleToggleConfirmModal(index)}>
													<FormattedMessage id='button.delete' />
												</Button>
											</div>
										</td>
									</tr>
								)}
							</TableBody>
						</Table>
					</TableGrid>

					<FooterContainer
						pagesize={queryParams.pagesize || 25}
						totalPages={totalPages}
						currentPage={+queryParams.page - 1}
						handlePageChange={handlePageChange}
						handleSelect={handleSelect}
					/>
				</div>
			</Container>
			<ConfirmModal
				idTitleIntl='dashboard.blogs.modal.blog_deletion_confirmation_modal.title'
				isOpen={statusConfirmModal}
				onClose={toggleConfirmModal}
				onSubmit={handleDelete}
			>
				<FormattedDescription
					id='dashboard.blogs.modal.blog_deletion_confirmation_modal.description'
					values={{ title: Blogs?.[blogIndex]?.title?.[languageId] || '' }}
				/>
			</ConfirmModal>

			<BlogModal
				languageId={languageId}
				blogId={Blogs?.[blogIndex]?._id}
				isOpen={statusModal}
				onClose={toggleEditorModal}
				onSubmitUpdate={handleUpdate}
				onSubmitCreate={handleCreate}
			/>
		</>
	);
}
