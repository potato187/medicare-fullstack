import { yupResolver } from '@hookform/resolvers/yup';
import { htmlContentApi } from 'api';
import {
	BaseModal,
	BaseModalBody,
	BaseModalFooter,
	BaseModalHeader,
	Button,
	FloatingLabelFile,
	FloatingLabelInput,
	FloatingLabelMultiSelect,
	FloatingLabelSelect,
	TextArea,
} from 'components';
import { getObjectDiff, setDefaultValues, tryCatch } from 'utils';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { defaultValues, schema } from './schema';

export function HtmlContentModal({
	isOpen = false,
	htmlContentId = null,
	pages = [],
	typePositions = [],
	onClose = () => false,
	onCreate = (f) => f,
	onUpdate = (f) => f,
}) {
	const clone = useRef(null);
	const methods = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema),
	});

	const handleSubmit = (data) => {
		if (clone.current) {
			const updateBody = getObjectDiff(clone.current, data);
			onUpdate(updateBody);
		} else {
			onCreate(data);
		}
	};

	const handleClose = () => {
		clone.current = null;
		onClose();
	};

	useEffect(() => {
		tryCatch(async () => {
			if (isOpen && htmlContentId) {
				const { metadata } = await htmlContentApi.getById(htmlContentId);
				setDefaultValues(methods, metadata);
				clone.current = metadata;
			} else {
				clone.current = null;
				setDefaultValues(methods, defaultValues);
			}
		})();
	}, [isOpen, htmlContentId]);

	return (
		<FormProvider {...methods}>
			<BaseModal isOpen={isOpen} onClose={handleClose}>
				<BaseModalHeader idIntl='dashboard.modules.html_content.modal.create.title' onClose={handleClose} />
				<BaseModalBody className='scrollbar'>
					<form onSubmit={methods.handleSubmit(handleSubmit)}>
						<div className='row'>
							<div className='col-12 col-md-6 mb-6'>
								<FloatingLabelInput name='title.vi' labelIntl='common.title.vi' />
							</div>
							<div className='col-12 col-md-6 mb-6'>
								<FloatingLabelInput name='title.en' labelIntl='common.title.en' />
							</div>
							<div className='col-12 col-md-6 mb-6'>
								<FloatingLabelInput name='url' labelIntl='common.link' />
							</div>
							<div className='col-12 col-md-6 mb-6'>
								<FloatingLabelInput name='index' labelIntl='common.index' />
							</div>
							<div className='col-12 col-md-6 mb-6 z-index-2'>
								<FloatingLabelMultiSelect name='pageType' labelIntl='common.pages' options={pages} />
							</div>
							<div className='col-12 col-md-6 mb-6 z-index-2'>
								<FloatingLabelSelect name='positionType' labelIntl='common.position' options={typePositions} />
							</div>
							<div className='col-12 col-md-6 mb-6'>
								<FloatingLabelFile name='image' labelIntl='common.image' />
							</div>
							<div className='col-12 mb-6'>
								<TextArea rows='5' name='content.vi' labelIntl='common.content.vi' />
							</div>
							<div className='col-12'>
								<TextArea rows='5' name='content.en' labelIntl='common.content.en' />
							</div>
						</div>
					</form>
				</BaseModalBody>
				<BaseModalFooter className='d-flex justify-content-end gap-2'>
					<Button type='button' size='xs' secondary onClick={handleClose}>
						<FormattedMessage id='button.close' />
					</Button>
					<Button type='submit' size='xs' onClick={methods.handleSubmit(handleSubmit)}>
						<FormattedMessage id={`button.${clone.current ? 'update' : 'add'}`} />
					</Button>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
