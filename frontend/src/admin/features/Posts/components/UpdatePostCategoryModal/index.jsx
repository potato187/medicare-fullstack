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
import { createUpdateBody, setDefaultValues } from 'admin/utilities';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { postCategorySchema } from '../../schema';

export function UpdatePostCategoryModal({
	postCategory = {},
	isOpen = false,
	toggle = () => false,
	onSubmit = () => null,
}) {
	const methods = useForm({
		mode: 'onChange',
		resolver: yupResolver(postCategorySchema),
	});

	const watchSlugViField = methods.watch('slug.vi', '');
	const watchSlugEnField = methods.watch('slug.en', '');

	const handleOnSubmit = (data) => {
		const { url, ...rest } = data;
		const updateBody = createUpdateBody(methods, rest);
		onSubmit(updateBody);
	};

	useEffect(() => {
		if (postCategory) {
			const { children, collapsed, depth, ...values } = postCategory;
			values.url = {
				vi: `${APP_URL}/${values.slug.vi}`,
				en: `${APP_URL}/${values.slug.en}`,
			};
			setDefaultValues(methods, values);
		}
	}, [postCategory, methods]);

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
				<BaseModalHeader idIntl='dashboard.posts.modal.category_update_modal.title' onClose={toggle} />
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(handleOnSubmit)}>
						<div className='row'>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='name.vi' labelIntl='dashboard.posts.modal.titleVi' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='name.en' labelIntl='dashboard.posts.modal.titleEn' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='slug.vi' labelIntl='dashboard.posts.modal.slug' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='slug.en' labelIntl='dashboard.posts.modal.slug' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='url.vi' labelIntl='dashboard.posts.modal.url' disabled />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='url.en' labelIntl='dashboard.posts.modal.url' disabled />
							</div>
							<div className='col-12'>
								<FieldCheckBox
									{...methods.register('display', {
										setValueAs: (v) => !!v,
									})}
									type='checkbox'
									labelIntl='dashboard.posts.modal.display'
								/>
							</div>
						</div>
					</form>
				</BaseModalBody>
				<BaseModalFooter>
					<div className='d-flex justify-content-end gap-2'>
						<Button secondary size='sm' onClick={toggle}>
							<FormattedMessage id='button.cancel' />
						</Button>
						<Button size='sm' onClick={methods.handleSubmit(handleOnSubmit)}>
							<FormattedMessage id='button.update' />
						</Button>
					</div>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
