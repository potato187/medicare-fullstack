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
import { blogCategoryDefaultValues, blogCategorySchema } from '../../schema';

export function BlogCategoryModal({
	isOpen = false,
	blogCategory,
	toggle = (f) => f,
	onCreate = (f) => f,
	onUpdate = (f) => f,
}) {
	const methods = useForm({
		defaultValues: blogCategoryDefaultValues,
		resolver: yupResolver(blogCategorySchema),
	});

	const handleOnSubmit = (data) => {
		if (blogCategory) {
			onUpdate(data);
		} else {
			onCreate(data);
		}
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

		if (!isOpen || !blogCategory) {
			setDefaultValues(methods, blogCategoryDefaultValues);
		}
	}, [isOpen, blogCategory, methods]);

	return (
		<FormProvider {...methods}>
			<BaseModal isOpen={isOpen} onClose={toggle}>
				<BaseModalHeader
					idIntl={`dashboard.blogs.modal.category_${blogCategory ? 'update' : 'create'}_modal.title`}
					onClose={toggle}
				/>
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(handleOnSubmit)}>
						<div className='row'>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='name.vi' labelIntl='dashboard.blogs.modal.titleEn' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='name.en' labelIntl='dashboard.blogs.modal.titleVi' />
							</div>
							{blogCategory && isOpen ? (
								<>
									<div className='col-6 mb-6'>
										<FloatingLabelInput name='url.vi' labelIntl='dashboard.blogs.modal.url' disabled />
									</div>
									<div className='col-6 mb-6'>
										<FloatingLabelInput name='url.en' labelIntl='dashboard.blogs.modal.url' disabled />
									</div>
								</>
							) : null}
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
							<FormattedMessage id={`button.${blogCategory ? 'update' : 'create'}`} />
						</Button>
					</div>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
