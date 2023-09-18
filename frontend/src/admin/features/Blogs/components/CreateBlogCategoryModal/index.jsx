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
import { blogCategoryDefaultValues, blogCategorySchema } from '../../schema';

export function CreateBlogCategoryModal({ isOpen = false, toggle = () => false, onSubmit = () => null }) {
	const methods = useForm({
		defaultValues: blogCategoryDefaultValues,
		resolver: yupResolver(blogCategorySchema),
	});

	const handleSubmit = (data) => {
		onSubmit(data);
		methods.reset();
	};

	return (
		<FormProvider {...methods}>
			<BaseModal isOpen={isOpen} onClose={toggle}>
				<BaseModalHeader idIntl='dashboard.blogs.modal.category_update_modal.title' onClose={toggle} />
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(handleSubmit)}>
						<div className='row'>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='name.vi' labelIntl='dashboard.blogs.modal.titleEn' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='name.en' labelIntl='dashboard.blogs.modal.titleVi' />
							</div>
							<div className='col-12'>
								<FieldCheckBox name='isDisplay' type='checkbox' labelIntl='dashboard.blogs.modal.display' />
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
