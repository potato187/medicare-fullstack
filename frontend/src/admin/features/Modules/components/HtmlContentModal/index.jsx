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
	FloatingLabelFile,
	FloatingLabelInput,
	FloatingLabelSelect,
	TextArea,
} from 'admin/components';

import { htmlContentApi } from 'admin/api';
import { setDefaultValues, tryCatch } from 'admin/utilities';

import { htmlContentDefaults, htmlContentValidation } from '../../schema';

export function HtmlContentModal({
	isOpen = false,
	htmlContentId = null,
	pages = [],
	typePositions = [],
	onClose = () => false,
	onSubmit = () => null,
}) {
	const methods = useForm({
		defaultValues: htmlContentDefaults,
		mode: 'onChange',
		resolver: yupResolver(htmlContentValidation),
	});

	useEffect(() => {
		const fetchHtmlContent = async () => {
			const { data } = await htmlContentApi.getById(htmlContentId);
			setDefaultValues(methods, data);
		};

		if (htmlContentId) {
			tryCatch(fetchHtmlContent)();
		} else {
			methods.reset();
		}
	}, [htmlContentId, methods]);

	return (
		<FormProvider {...methods}>
			<BaseModal isOpen={isOpen} onClose={onClose}>
				<BaseModalHeader idIntl='dashboard.modules.html_content.modal.create_html_content.title' onClose={onClose} />
				<BaseModalBody className='scrollbar'>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<div className='row'>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='title_vi' labelIntl='common.title.vi' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='title_en' labelIntl='common.title.en' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='url' labelIntl='common.link' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='index' labelIntl='common.index' />
							</div>
							<div className='col-6 mb-6 z-index-2'>
								<FloatingLabelSelect name='pageId' labelIntl='common.pages' options={pages} />
							</div>
							<div className='col-6 mb-6 z-index-2'>
								<FloatingLabelSelect name='typePositionId' labelIntl='common.position' options={typePositions} />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelFile name='image' labelIntl='common.image' />
							</div>
							<div className='col-12 mb-6'>
								<TextArea rows='5' name='content_vi' labelIntl='common.content.vi' />
							</div>
							<div className='col-12 mb-6'>
								<TextArea rows='5' name='content_en' labelIntl='common.content.en' />
							</div>
						</div>
					</form>
				</BaseModalBody>
				<BaseModalFooter className='d-flex justify-content-end gap-2'>
					<Button type='button' size='sm' secondary onClick={onClose}>
						<FormattedMessage id='button.close' />
					</Button>
					<Button
						isLoading={methods.formState.isSubmitting}
						type='submit'
						size='sm'
						onClick={methods.handleSubmit(onSubmit)}
					>
						<FormattedMessage id='button.create' />
					</Button>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
