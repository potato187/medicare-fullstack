import { yupResolver } from '@hookform/resolvers/yup';
import {
	BaseModal,
	BaseModalBody,
	BaseModalFooter,
	BaseModalHeader,
	Button,
	FieldCheckBox,
	FloatingLabelInput,
} from 'admin/components';
import { APP_URL } from 'admin/constant';
import { setDefaultValues } from 'admin/utilities';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { blogCategorySchema } from '../../schema';

export function UpdateBlogCategoryModal({
	blogCategory = {},
	isOpen = false,
	toggle = () => false,
	onSubmit = () => null,
}) {
	const methods = useForm({
		mode: 'onChange',
		resolver: yupResolver(blogCategorySchema),
	});

	const watchSlugViField = methods.watch('slug.vi', '');
	const watchSlugEnField = methods.watch('slug.en', '');

	const handleOnSubmit = (data) => {
		onSubmit(data);
	};

	useEffect(() => {
		if (isOpen && blogCategory) {
			const { children, collapsed, depth, ...values } = blogCategory;
			values.url = {
				vi: `${APP_URL}/${values.slug.vi}`,
				en: `${APP_URL}/${values.slug.en}`,
			};

			setDefaultValues(methods, values);
		}
	}, [isOpen, blogCategory, methods]);

	useEffect(() => {
		if (isOpen) {
			methods.setValue('url.vi', `${APP_URL}/${methods.getValues('slug.vi') || ''}`, {
				shouldDirty: false,
				shouldTouch: false,
			});
		}
	}, [isOpen, watchSlugViField, methods]);

	useEffect(() => {
		if (isOpen) {
			methods.setValue('url.en', `${APP_URL}/${methods.getValues('slug.en') || ''}`, {
				shouldDirty: false,
				shouldTouch: false,
			});
		}
	}, [isOpen, watchSlugEnField, methods]);

	return (
		<FormProvider {...methods}>
			<BaseModal isOpen={isOpen} onClose={toggle}>
				<BaseModalHeader idIntl='dashboard.blogs.modal.category_update_modal.title' onClose={toggle} />
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(handleOnSubmit)}>
						<div className='row'>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='name.vi' labelIntl='dashboard.blogs.modal.titleVi' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='name.en' labelIntl='dashboard.blogs.modal.titleEn' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='slug.vi' labelIntl='dashboard.blogs.modal.slug' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='slug.en' labelIntl='dashboard.blogs.modal.slug' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='url.vi' labelIntl='dashboard.blogs.modal.url' disabled />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='url.en' labelIntl='dashboard.blogs.modal.url' disabled />
							</div>
							<div className='col-12'>
								<FieldCheckBox name='isDisplay' type='checkbox' labelIntl='dashboard.blogs.modal.display' />
							</div>
						</div>
					</form>
				</BaseModalBody>
				<BaseModalFooter>
					<div className='d-flex justify-content-end gap-2'>
						<Button secondary size='xs' onClick={toggle}>
							<FormattedMessage id='button.cancel' />
						</Button>
						<Button size='xs' onClick={methods.handleSubmit(handleOnSubmit)}>
							<FormattedMessage id='button.update' />
						</Button>
					</div>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
