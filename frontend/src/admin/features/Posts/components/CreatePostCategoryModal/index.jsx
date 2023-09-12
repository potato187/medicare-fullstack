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
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { postCategoryDefaultValues, postCategorySchema } from '../../schema';

export function CreatePostCategoryModal({ isOpen = false, toggle = () => false, onSubmit = () => null }) {
	const methods = useForm({
		defaultValues: postCategoryDefaultValues,
		resolver: yupResolver(postCategorySchema),
	});

	const handleSubmit = (data) => {
		onSubmit(data);
		methods.reset();
	};

	return (
		<FormProvider {...methods}>
			<BaseModal isOpen={isOpen} onClose={toggle}>
				<BaseModalHeader idIntl='dashboard.posts.modal.category_update_modal.title' onClose={toggle} />
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(handleSubmit)}>
						<div className='row'>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='name.vi' labelIntl='dashboard.posts.modal.titleEn' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='name.en' labelIntl='dashboard.posts.modal.titleVi' />
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
						<Button size='sm' onClick={methods.handleSubmit(handleSubmit)}>
							<FormattedMessage id='button.create' />
						</Button>
					</div>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
