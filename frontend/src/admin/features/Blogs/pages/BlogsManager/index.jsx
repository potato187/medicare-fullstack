import { blogApi } from 'api';
import {
	Button,
	ConfirmModal,
	Container,
	ContainerGrid,
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
} from 'components';
import { useAsyncLocation, useAuth, useIndex, useToggle } from 'hooks';
import produce from 'immer';
import { useMemo } from 'react';
import { MdAdd } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { compose, formatDate, formatISODate, showToastMessage, tryCatchAndToast } from 'utils';
import { BlogModal } from '../../components';
import { DEFAULT_OPTION } from '../../constant';
import { useFetchBlogCategories } from '../../hooks/useFetchBlogCategories';

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
			<Container id='page-main' className='py-4'>
				<ContainerGrid>
					<div className='row pb-4 gx-2'>
						<div className='col-10 col-sm-6'>
							<div className='d-flex items-end gap-2'>
								<UnFieldDebounce
									delay={500}
									type='text'
									placeholderIntl='form.search_placeholder'
									ariallabel='search field'
									id='form-search'
									onChange={handleChangeSearch}
								/>
								<DropdownTree
									size='md'
									languageId={languageId}
									nameGroup='post-categories'
									value={queryParams?.categoryId}
									options={blogCategoryOptions}
									onChange={handleSelectCategory}
								/>
							</div>
						</div>
						<div className='col-2 col-sm-6'>
							<div className='d-flex justify-content-end'>
								<Button size='sm' square onClick={() => handleToggleModal(-1)}>
									<MdAdd size='1.25em' />
								</Button>
							</div>
						</div>
					</div>
					<TableGrid className='scrollbar'>
						<Table hover striped fixed>
							<TableHeader>
								<th className='text-center' style={{ width: '80px' }}>
									<FormattedMessage id='table.no' />
								</th>
								<SortableTableHeader
									className='text-start'
									name='title'
									intl='common.title.default'
									onChange={handleChangeSort}
									style={{ width: '500px' }}
								/>
								<SortableTableHeader
									className='text-center'
									name='datePublished'
									intl='common.public_date'
									onChange={handleChangeSort}
									style={{ width: '180px' }}
								/>
								<SortableTableHeader
									className='text-center'
									name='isDisplay'
									intl='form.display'
									onChange={handleChangeSort}
									style={{ width: '180px' }}
								/>
								<th className='text-center' style={{ width: '240px' }}>
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
				</ContainerGrid>
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
