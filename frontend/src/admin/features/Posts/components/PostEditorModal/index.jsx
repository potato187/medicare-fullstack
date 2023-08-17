import { postApi } from '@/admin/api';
import {
	BaseModal,
	BaseModalBody,
	BaseModalFooter,
	BaseModalHeader,
	Breadcrumb,
	Button,
	FieldFileUpload,
	FloatingDatePicker,
	FloatingLabelInput,
	FormInputEditor,
	SelectorTree,
	TextArea,
} from '@/admin/components';
import { useQuery } from '@/admin/hooks';
import { setDefaultValues } from '@/admin/utilities';
import { tryCatch } from '@/shared/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { postDefaultValues, postSchema } from '../../schema';

const POST_SITE_MAP = {
	INFORMATION: ['common.title', 'common.information'],
	CATEGORIES: ['common.title', 'common.categories'],
	SHORT_DESCRIPTION_VI: ['common.title', 'common.short_description_vi'],
	SHORT_DESCRIPTION_EN: ['common.title', 'common.short_description_en'],
	CONTENT_VI: ['common.title', 'common.content_vi'],
	CONTENT_EN: ['common.title', 'common.content_en'],
};

export const PostEditorModal = ({
	languageId = 'en',
	postId = undefined,
	isOpen = false,
	onClose = () => false,
	onSubmit = () => null,
}) => {
	const methods = useForm({
		defaultValues: postDefaultValues,
		mode: 'onChange',
		resolver: yupResolver(postSchema),
	});

	const { PostCategories, setPostCategories } = useQuery(
		'PostCategories',
		{
			from: 'postCategory',
			where: ['display=1'],
			attributes: ['id', 'index', 'parentId', 'titleEn', 'titleVi'],
			order: [['index', 'asc']],
		},
		(response) => {
			return response.map((postCategory) => ({
				id: postCategory.id,
				parentId: postCategory.parentId,
				title: postCategory[`title_${languageId}`],
				isSelected: !!postCategory.isSelected,
			}));
		},
		[languageId],
	);

	const handleOnClose = () => {
		setPostCategories((prevCategories) => {
			return prevCategories.map((category) => ({
				...category,
				isSelected: false,
			}));
		});
		methods.reset();
		onClose();
	};

	const handleOnSubmit = (data) => {
		const categoryIds = PostCategories.filter((category) => category.isSelected).map(({ id }) => id);
		onSubmit({ postData: data, categoryIds });
	};

	useEffect(() => {
		const fetchPost = async () => {
			const { data = {} } = await postApi.getById(postId);
			const { post = null, categories } = data;
			if (post) {
				post.publicDate = moment(post.publicDate).toDate();
				setDefaultValues(methods, post);
			}

			if (categories && categories.length) {
				setPostCategories((prevCategories) => {
					return prevCategories.map((category) => ({
						...category,
						isSelected: categories.includes(category.id),
					}));
				});
			}
		};

		if (postId) {
			tryCatch(fetchPost)();
		} else {
			setDefaultValues(methods, postDefaultValues);
		}
	}, [postId, languageId, isOpen]);

	return (
		<FormProvider {...methods}>
			<BaseModal size='xl' isOpen={isOpen} onClose={handleOnClose}>
				<BaseModalHeader idIntl='dashboard.posts.modal.post_editor_modal.title' onClose={handleOnClose} />
				<BaseModalBody className='scrollbar'>
					<div className='row'>
						<div className='col-9'>
							<form onSubmit={methods.handleSubmit(handleOnSubmit)}>
								<div className='block mb-5'>
									<div className='block-header'>
										<Breadcrumb breadcrumb={POST_SITE_MAP.INFORMATION}>
											{(item, index) => (
												<li key={index}>
													<span>{<FormattedMessage id={item} />}</span>
												</li>
											)}
										</Breadcrumb>
									</div>
									<div className='block-body'>
										<div className='row'>
											<div className='col-6'>
												<div className='mb-6'>
													<FloatingLabelInput name='title_vi' labelIntl='common.title_vi' />
												</div>
												<div className='mb-6'>
													<FloatingLabelInput name='title_en' labelIntl='common.title_en' />
												</div>
												<div className='mb-6'>
													<FloatingDatePicker name='publicDate' labelIntl='common.public_date' />
												</div>
											</div>
											<div className='col-6'>
												<FieldFileUpload name='thumbnail' intlLabel='common.thumbnail' />
											</div>
										</div>
									</div>
								</div>

								<div className='block mb-5'>
									<div className='block-header'>
										<Breadcrumb breadcrumb={POST_SITE_MAP.SHORT_DESCRIPTION_VI}>
											{(item, index) => (
												<li key={index}>
													<span>{<FormattedMessage id={item} />}</span>
												</li>
											)}
										</Breadcrumb>
									</div>
									<div className='block-body'>
										<TextArea
											rows='4'
											maxLength='255'
											name='shortDescription_en'
											labelIntl='common.short_description_vi'
										/>
									</div>
								</div>

								<div className='block mb-5'>
									<div className='block-header'>
										<Breadcrumb breadcrumb={POST_SITE_MAP.SHORT_DESCRIPTION_EN}>
											{(item, index) => (
												<li key={index}>
													<span>{<FormattedMessage id={item} />}</span>
												</li>
											)}
										</Breadcrumb>
									</div>
									<div className='block-body'>
										<TextArea
											rows='4'
											maxLength='255'
											name='shortDescription_vi'
											labelIntl='common.short_description_en'
										/>
									</div>
								</div>

								<div className='block mb-5'>
									<div className='block-header'>
										<Breadcrumb breadcrumb={POST_SITE_MAP.CONTENT_VI}>
											{(item, index) => (
												<li key={index}>
													<span>{<FormattedMessage id={item} />}</span>
												</li>
											)}
										</Breadcrumb>
									</div>
									<div className='block-body'>
										<FormInputEditor name='content_vi' />
									</div>
								</div>

								<div className='block mb-5'>
									<div className='block-header'>
										<Breadcrumb breadcrumb={POST_SITE_MAP.CONTENT_EN}>
											{(item, index) => (
												<li key={index}>
													<span>{<FormattedMessage id={item} />}</span>
												</li>
											)}
										</Breadcrumb>
									</div>
									<div className='block-body'>
										<FormInputEditor name='content_en' />
									</div>
								</div>
							</form>
						</div>
						<div className='col-3'>
							<div className='block position-sticky top-0'>
								<div className='block-header'>
									<Breadcrumb breadcrumb={POST_SITE_MAP.CATEGORIES}>
										{(item, index) => (
											<li key={index}>
												<span>{<FormattedMessage id={item} />}</span>
											</li>
										)}
									</Breadcrumb>
								</div>
								<div className='block-body'>
									<SelectorTree name='categories' tree={PostCategories} setTree={setPostCategories} multiple />
								</div>
							</div>
						</div>
					</div>
				</BaseModalBody>
				<BaseModalFooter>
					<div className='d-flex justify-content-center gap-2'>
						<Button type='button' size='xs' secondary onClick={handleOnClose}>
							<FormattedMessage id='button.cancel' />
						</Button>
						<Button type='submit' size='xs' onClick={methods.handleSubmit(handleOnSubmit)}>
							<FormattedMessage id={postId ? 'button.update' : 'button.create'} />
						</Button>
					</div>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
};
