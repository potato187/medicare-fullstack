import { yupResolver } from '@hookform/resolvers/yup';
import { blogApi, blogCategoryApi } from 'api';
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
} from 'components';
import { findIndexById, findIndexByParentId } from 'components/AdvanceUI/Tree/utils';
import produce from 'immer';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { getObjectDiff, setDefaultValues, tryCatch } from 'utils';
import { defaultValues, schema } from './schema';

const BLOG_SITE_MAP = {
	INFORMATION: ['common.blog', 'common.information'],
	CATEGORIES: ['common.blog', 'common.categories'],
	SUMMARY_VI: ['common.blog', 'common.summary.vi'],
	SUMMARY_EN: ['common.blog', 'common.summary.en'],
	CONTENT_VI: ['common.blog', 'common.content.vi'],
	CONTENT_EN: ['common.blog', 'common.content.en'],
};

export function BlogModal({
	blogId,
	languageId = 'en',
	isOpen = false,
	onClose = () => false,
	onSubmitUpdate = () => null,
	onSubmitCreate = () => null,
}) {
	const clone = useRef(null);
	const methods = useForm({
		defaultValues,
		mode: 'onChange',
		resolver: yupResolver(schema),
	});
	const [blogCategories, setBlogCategories] = useState([]);

	const updateBlogCategories = (value) => {
		setBlogCategories(
			produce((draft) => {
				const index = findIndexById(draft, value);
				draft[index].isSelected = !draft[index].isSelected;
				if (draft[index].isSelected) {
					const parentIndices = findIndexById(draft, draft[index].parentId);
					while (parentIndices.length) {
						const index = parentIndices.pop();
						const { parentId } = draft[index];
						draft[index].isSelected = true;
						if (parentId) {
							parentIndices.push(...findIndexById(draft, parentId));
						}
					}
				} else {
					const childIndices = findIndexById(draft, draft[index].id);
					while (childIndices.length) {
						const index = childIndices.pop();
						const { id } = draft[index];
						draft[index].isSelected = false;
						childIndices.push(...findIndexByParentId(draft, id));
					}
				}
			}),
		);
	};

	const handleSubmit = (data) => {
		const blogCategoryIds = blogCategories.filter((category) => category.isSelected).map(({ id }) => id);
		if (blogId) {
			const updateBody = getObjectDiff(clone.current, data);
			onSubmitUpdate({ blogId, ...updateBody, blogCategoryIds });
		} else {
			onSubmitCreate({ ...data, blogCategoryIds });
		}
	};

	useEffect(() => {
		tryCatch(async () => {
			const blogCategoryIds = [];
			if (isOpen && blogId) {
				const { metadata } = await blogApi.getOneById(blogId);
				const { blogCategoryIds: Ids, tags, ...blog } = metadata;
				blogCategoryIds.push(...Ids);
				setDefaultValues(methods, blog);
				clone.current = blog;
			}

			if (isOpen) {
				const { metadata: listBlogCategories } = await blogCategoryApi.getFlattenAll();
				setBlogCategories(
					listBlogCategories.map(({ _id, ...blogCategory }) => ({
						id: _id,
						...blogCategory,
						children: [],
						isSelected: blogCategoryIds.includes(_id),
					})),
				);
			}

			if (!isOpen) {
				setBlogCategories((prevCategories) => {
					return prevCategories.map((category) => ({
						...category,
						isSelected: false,
					}));
				});
				methods.reset();
			}
		})();
	}, [isOpen, blogId]);

	return (
		<FormProvider {...methods}>
			<BaseModal size='xl' isOpen={isOpen} onClose={onClose}>
				<BaseModalHeader idIntl='dashboard.blogs.modal.blog.update.title' onClose={onClose} />
				<BaseModalBody className='scrollbar'>
					<div className='row'>
						<div className='col-12 col-lg-9 order-2 order-lg-1'>
							<form onSubmit={methods.handleSubmit(handleSubmit)}>
								<div className='block mb-5'>
									<div className='block-header'>
										<Breadcrumb breadcrumb={BLOG_SITE_MAP.INFORMATION}>
											{(item, index) => (
												<li key={index}>
													<span>
														<FormattedMessage id={item} />
													</span>
												</li>
											)}
										</Breadcrumb>
									</div>
									<div className='block-body'>
										<div className='row'>
											<div className='col-12 col-lg-6 order-2 order-lg-1'>
												<div className='mb-6'>
													<FloatingLabelInput name='title.vi' labelIntl='common.title.vi' />
												</div>
												<div className='mb-6'>
													<FloatingLabelInput name='title.en' labelIntl='common.title.en' />
												</div>

												<div className='mb-6'>
													<FloatingDatePicker name='datePublished' labelIntl='common.public_date' />
												</div>
											</div>
											<div className='col-12 col-sm-10 offset-sm-1 offset-lg-0 col-lg-6 order-1 order-lg-2 mb-4 mb-lg-0'>
												<FieldFileUpload name='image' intlLabel='common.thumbnail' />
											</div>
										</div>
									</div>
								</div>

								<div className='block mb-5'>
									<div className='block-header'>
										<Breadcrumb breadcrumb={BLOG_SITE_MAP.SUMMARY_VI}>
											{(item, index) => (
												<li key={index}>
													<span>
														<FormattedMessage id={item} />
													</span>
												</li>
											)}
										</Breadcrumb>
									</div>
									<div className='block-body'>
										<TextArea rows='4' maxLength='100' name='summary.en' labelIntl='common.summary.vi' />
									</div>
								</div>

								<div className='block mb-5'>
									<div className='block-header'>
										<Breadcrumb breadcrumb={BLOG_SITE_MAP.SUMMARY_EN}>
											{(item, index) => (
												<li key={index}>
													<span>
														<FormattedMessage id={item} />
													</span>
												</li>
											)}
										</Breadcrumb>
									</div>
									<div className='block-body'>
										<TextArea rows='4' maxLength='100' name='summary.vi' labelIntl='common.summary.en' />
									</div>
								</div>

								<div className='block mb-5'>
									<div className='block-header'>
										<Breadcrumb breadcrumb={BLOG_SITE_MAP.CONTENT_VI}>
											{(item, index) => (
												<li key={index}>
													<span>
														<FormattedMessage id={item} />
													</span>
												</li>
											)}
										</Breadcrumb>
									</div>
									<div className='block-body'>
										<FormInputEditor name='content.vi' />
									</div>
								</div>

								<div className='block mb-5'>
									<div className='block-header'>
										<Breadcrumb breadcrumb={BLOG_SITE_MAP.CONTENT_EN}>
											{(item, index) => (
												<li key={index}>
													<span>
														<FormattedMessage id={item} />
													</span>
												</li>
											)}
										</Breadcrumb>
									</div>
									<div className='block-body'>
										<FormInputEditor name='content.en' />
									</div>
								</div>
							</form>
						</div>
						<div className='col-12 col-lg-3 order-1 order-lg-2 mb-4 mb-lg-0'>
							<div className='block position-sticky top-0'>
								<div className='block-header'>
									<Breadcrumb breadcrumb={BLOG_SITE_MAP.CATEGORIES}>
										{(item, index) => (
											<li key={index}>
												<span>
													<FormattedMessage id={item} />
												</span>
											</li>
										)}
									</Breadcrumb>
								</div>
								<div className='block-body'>
									<SelectorTree
										languageId={languageId}
										name='categories'
										tree={blogCategories}
										onChange={updateBlogCategories}
										multiple
									/>
								</div>
							</div>
						</div>
					</div>
				</BaseModalBody>
				<BaseModalFooter>
					<div className='d-flex justify-content-center gap-2'>
						<Button type='button' size='xs' secondary onClick={onClose}>
							<FormattedMessage id='button.cancel' />
						</Button>
						<Button type='submit' size='xs' onClick={methods.handleSubmit(handleSubmit)}>
							<FormattedMessage id={blogId ? 'button.update' : 'button.create'} />
						</Button>
					</div>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
