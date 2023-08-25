import produce from 'immer';
import React, { useRef } from 'react';
import { MdAdd } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { postApi } from 'admin/api';
import {
	Button,
	ConfirmModal,
	Container,
	DropdownIntl,
	DropdownTree,
	FooterContainer,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
	SortableTableHeader,
	UnFieldDebounce,
	UnFieldSwitch,
	FormattedDescription,
} from 'admin/components';
import { useAsyncLocation, useQuery, useToggle } from 'admin/hooks';
import { compose } from 'admin/utilities';
import { useAuth } from 'hooks';
import { formatDate } from 'utils';
import { PostEditorModal } from '../../components/PostEditorModal';
import { POST_SEARCH_OPTIONS } from '../../constant';

const DEFAULT_OPTION = [
	{
		id: 'all',
		title_en: 'All',
		title_vi: 'Tất cả',
		parentId: null,
		index: 0,
		isSelected: true,
		name: 'group-post-categories',
	},
];

export function PostManager() {
	const { languageId } = useAuth();
	const localTitle = `title_${languageId}`;

	const {
		data: Posts,
		setData: setPosts,
		queryParams,
		searchBy,
		setQueryParams,
		handleOnChangeSearch,
		handleOnSort,
		handleOnSelect,
		handleOnPageChange,
	} = useAsyncLocation({
		fetchFnc: postApi.getByParams,
		params: {
			search_by: 'postTitle',
			postCategoryId: 'all',
		},
	});

	const { PostCategories } = useQuery(
		'PostCategories',
		{
			from: 'postCategory',
			where: ['display=1'],
			attributes: ['id', 'index', 'parentId', 'titleEn', 'titleVi'],
			order: [['index', 'asc']],
		},
		(response) => {
			return [...DEFAULT_OPTION, ...response].map((postCategory) => ({
				id: postCategory.id,
				title: postCategory[`title_${languageId}`],
				parentId: postCategory.parentId,
				index: postCategory.index,
				isSelected: postCategory.id === queryParams.postCategoryId,
				name: 'group-post-categories',
			}));
		},
		[languageId, queryParams],
	);

	const postIndexRef = useRef(-1);
	const [statusConfirmModal, toggleConfirmModal] = useToggle();
	const [statusEditorModal, toggleEditorModal] = useToggle();

	const updatePostIndex = (index) => {
		if (postIndexRef.current !== index) {
			postIndexRef.current = index;
		}
	};

	const openConfirmModal = compose(updatePostIndex, toggleConfirmModal);
	const openEditorModal = compose(updatePostIndex, toggleEditorModal);

	const onChangePostCategory = (postCategoryId) => {
		setQueryParams({ postCategoryId });
	};

	const submitCreatePost = async ({ postData, categoryIds }) => {
		try {
			const { id } = postData;
			const { data, message } = await postApi.createOrUpdateOne({ postData, categoryIds });

			setPosts(
				produce((draft) => {
					const index = draft.findIndex((post) => post.id === id);
					if (index > -1) {
						draft[index] = { ...draft[index], ...data.post };
					} else {
						draft.push(data.post);
					}
				}),
			);

			toast.success(message[languageId]);
			toggleEditorModal();
		} catch (error) {
			toast.error(error.message[languageId]);
		}
	};

	const submitDeletePost = async () => {
		try {
			const { message } = await postApi.deleteOne(Posts[postIndexRef.current].id);
			setPosts(
				produce((draft) => {
					draft.splice(postIndexRef.current, 1);
					postIndexRef.current = -1;
				}),
			);
			toast.success(message[languageId]);
			toggleConfirmModal();
		} catch (error) {
			toast.error(error.message[languageId]);
		}
	};

	const onChangeDisplayPost = async (data) => {
		try {
			const { index, ...post } = data;
			const { message } = await postApi.toggleDisplayPost(post.id);
			setPosts(
				produce((draft) => {
					draft[index].display = +data.display;
				}),
			);
			toast.success(message[languageId]);
		} catch (error) {
			toast.error(error.message[languageId]);
		}
	};

	return (
		<>
			<Container id='page-main'>
				<div className='d-flex flex-column h-100 py-5'>
					<div className='d-flex pb-4'>
						<div className='d-flex items-end gap-2'>
							<DropdownTree
								size='md'
								nameGroup='post-categories'
								options={PostCategories}
								value={queryParams.postCategoryId}
								onChange={onChangePostCategory}
							/>
							<div className='d-flex'>
								<DropdownIntl
									name='search_by'
									options={POST_SEARCH_OPTIONS}
									value={searchBy}
									onSelect={handleOnSelect}
								/>
								<UnFieldDebounce
									delay={500}
									onChange={handleOnChangeSearch}
									initialValue={queryParams.search}
									type='text'
									placeholderIntl='form.search_placeholder'
									ariallabel='search field'
									id='debounce-search-field'
								/>
							</div>
						</div>
						<div className='px-5 d-flex gap-2 ms-auto'>
							<Button size='sm' onClick={() => openEditorModal(-1)}>
								<span>
									<FormattedMessage id='dashboard.posts.modal.button_create_post' />
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
									sortMap={queryParams.sort}
									name={localTitle}
									intl='common.title'
									onSort={handleOnSort}
								/>
								<SortableTableHeader
									className='text-center'
									sortMap={queryParams.sort}
									name='publicDate'
									intl='common.public_date'
									onSort={handleOnSort}
								/>
								<SortableTableHeader
									className='text-center'
									sortMap={queryParams.sort}
									name='createdAt'
									intl='common.created_at'
									onSort={handleOnSort}
								/>
								<SortableTableHeader
									className='text-center'
									sortMap={queryParams.sort}
									name='display'
									intl='form.display'
									onSort={handleOnSort}
								/>
								<th className='text-center'>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody>
								{Posts.map((post, index) => (
									<tr key={post.id}>
										<td className='text-center'>{index + 1}</td>
										<td className='text-truncate'>{post[`title_${languageId}`]}</td>
										<td className='text-center'>{formatDate(post.publicDate)}</td>
										<td className='text-center'>{formatDate(post.createdAt)}</td>
										<td className='text-center'>
											<UnFieldSwitch
												name={post.id}
												checked={+post.display === 1}
												onChange={(event) => onChangeDisplayPost({ id: post.id, display: event.target.checked, index })}
											/>
										</td>
										<td>
											<div className='d-flex justify-content-center gap-2'>
												<Button success size='xs' info onClick={() => openEditorModal(index)}>
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
						per_page={queryParams.per_page}
						totalPages={queryParams.totalPages}
						handleOnSelect={handleOnSelect}
						handleOnPageChange={handleOnPageChange}
					/>
				</div>
			</Container>

			<PostEditorModal
				languageId={languageId}
				postId={postIndexRef.current > -1 ? Posts[postIndexRef.current].id : undefined}
				isOpen={statusEditorModal}
				onClose={toggleEditorModal}
				onSubmit={submitCreatePost}
			/>

			<ConfirmModal
				idTitleIntl='dashboard.posts.modal.post_deletion_confirmation_modal.title'
				isOpen={statusConfirmModal}
				onClose={toggleConfirmModal}
				onSubmit={submitDeletePost}
			>
				<FormattedDescription
					id='dashboard.posts.modal.post_deletion_confirmation_modal.description'
					values={{ title: Posts?.[postIndexRef.current]?.[`title_${languageId}`] || '' }}
				/>
			</ConfirmModal>
		</>
	);
}
