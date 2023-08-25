import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import {
	BaseModal,
	BaseModalBody,
	BaseModalFooter,
	BaseModalHeader,
	Button,
	FieldCheckBox,
	FloatingLabelInput,
} from '@/admin/components';
import { postCategorySchema } from '../../schema';

export function ModifyCategoryModal({
	defaultValues = {},
	isOpen = false,
	toggle = () => false,
	onSubmit = () => null,
}) {
	const methods = useForm({
		resolver: yupResolver(postCategorySchema),
	});

	const watchSlugField = methods.watch('slug');

	useEffect(() => {
		methods.clearErrors();
		Object.entries(defaultValues).forEach(([key, value]) => {
			methods.setValue(key, value);
		});
	}, [defaultValues, methods]);

	useEffect(() => {
		methods.setValue('url', methods.getValues('slug'));
	}, [watchSlugField, methods]);

	return (
		<FormProvider {...methods}>
			<BaseModal isOpen={isOpen} onClose={toggle}>
				<BaseModalHeader idIntl='dashboard.posts.modal.category_update_modal.title' onClose={toggle} />
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<div className='row'>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='title_en' labelIntl='dashboard.posts.modal.titleEn' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='title_vi' labelIntl='dashboard.posts.modal.titleVi' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='slug' labelIntl='dashboard.posts.modal.slug' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='url' labelIntl='dashboard.posts.modal.url' disabled />
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
						<Button size='sm' onClick={methods.handleSubmit(onSubmit)}>
							<FormattedMessage id='button.update' />
						</Button>
					</div>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
