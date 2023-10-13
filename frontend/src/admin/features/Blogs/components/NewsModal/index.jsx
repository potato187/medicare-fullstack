import { yupResolver } from '@hookform/resolvers/yup';
import { newsApi } from 'api';
import {
	BaseModal,
	BaseModalBody,
	BaseModalFooter,
	BaseModalHeader,
	Button,
	FieldCheckBox,
	FloatingLabelInput,
	FloatingLabelMultiSelect,
	FloatingLabelSelect,
} from 'components';
import { getObjectDiff, setDefaultValues, tryCatch } from 'utils';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { defaultValues, schema } from './schema';

export function NewsModal({
	isOpen = false,
	newsId = null,
	pages = [],
	positions = [],
	orders = [],
	onClose = (f) => f,
	onCreate = (f) => f,
	onUpdate = (f) => f,
}) {
	const clone = useRef(null);
	const typeModal = newsId ? 'update' : 'create';
	const methods = useForm({
		defaultValues,
		mode: 'onChange',
		resolver: yupResolver(schema),
	});

	const handleOnSubmit = (data) => {
		if (clone.current) {
			const updateBody = getObjectDiff(clone.current, data);
			onUpdate(updateBody);
		} else {
			const { _id, ...body } = data;
			onCreate(body);
		}
	};

	const handleOnClose = () => {
		clone.current = null;
		onClose();
	};

	useEffect(() => {
		if (isOpen && newsId) {
			tryCatch(async () => {
				const { metadata } = await newsApi.getOneById(newsId);
				setDefaultValues(methods, metadata);
				clone.current = { ...metadata };
			})();
		}
		if (!isOpen || !newsId) {
			setDefaultValues(methods, defaultValues);
		}
	}, [isOpen, newsId]);

	return (
		<FormProvider {...methods}>
			<BaseModal isOpen={isOpen} onClose={handleOnClose}>
				<BaseModalHeader idIntl={`dashboard.blogs.news.modals.${typeModal}.title`} onClose={handleOnClose} />
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(handleOnSubmit)}>
						<div className='row'>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='name.vi' labelIntl='common.title.vi' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='name.en' labelIntl='common.title.en' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='index' labelIntl='common.index' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='quantity' labelIntl='common.quantity' />
							</div>
							<div className='col-6 mb-6 z-index-3'>
								<FloatingLabelSelect name='order' labelIntl='common.order' options={orders} />
							</div>
							<div className='col-6 mb-6 z-index-2'>
								<FloatingLabelSelect name='positionType' labelIntl='common.position' options={positions} />
							</div>
							<div className='col-6 mb-6 z-index-2'>
								<FloatingLabelMultiSelect name='pageType' labelIntl='common.pages' options={pages} />
							</div>
							<div className='col-12'>
								<FieldCheckBox name='isDisplay' type='checkbox' labelIntl='common.display' />
							</div>
						</div>
					</form>
				</BaseModalBody>
				<BaseModalFooter className='d-flex justify-content-end gap-2'>
					<Button type='button' size='xs' secondary onClick={handleOnClose}>
						<FormattedMessage id='button.close' />
					</Button>
					<Button type='submit' size='xs' onClick={methods.handleSubmit(handleOnSubmit)}>
						<FormattedMessage id={`button.${typeModal}`} />
					</Button>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
