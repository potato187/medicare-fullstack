import { yupResolver } from '@hookform/resolvers/yup';
import {
	BaseModal,
	BaseModalBody,
	BaseModalFooter,
	BaseModalHeader,
	Button,
	FieldCheckBox,
	FloatingLabelInput,
} from 'components';
import { getObjectDiff, setDefaultValues, tryCatch } from 'utils';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { linkApi } from 'api';
import { defaultValues, schema } from './schema';

export function LinkModal({
	isOpen = false,
	linkId = null,
	titleIntl = '',
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

	const handleOnSubmit = (data) => {
		if (clone.current) {
			const updateBody = getObjectDiff(clone.current, data);
			onUpdate({ id: linkId, ...updateBody });
		} else {
			onCreate(data);
		}
	};

	const handleOnClose = () => {
		clone.current = null;
		onClose();
	};

	useEffect(() => {
		if (isOpen && linkId) {
			tryCatch(async () => {
				const { metadata } = await linkApi.getOneById(linkId);
				if (Object.keys(metadata).length) {
					setDefaultValues(methods, { _id: linkId, ...metadata });
					clone.current = { ...metadata };
				}
			})();
		} else {
			methods.reset();
		}
	}, [isOpen, linkId]);

	return (
		<FormProvider {...methods}>
			<BaseModal isOpen={isOpen} onClose={handleOnClose}>
				<BaseModalHeader idIntl={titleIntl} onClose={handleOnClose} />
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(handleOnSubmit)}>
						<div className='row'>
							<div className='col-12 col-md-6 mb-6'>
								<FloatingLabelInput name='name.vi' labelIntl='common.title.vi' />
							</div>
							<div className='col-12 col-md-6 mb-6'>
								<FloatingLabelInput name='name.en' labelIntl='common.title.en' />
							</div>
							<div className='col-12 col-md-6 mb-6'>
								<FloatingLabelInput name='url' labelIntl='common.link' />
							</div>
							<div className='col-12'>
								<FieldCheckBox name='isDisplay' type='checkbox' labelIntl='form.display' />
							</div>
						</div>
					</form>
				</BaseModalBody>
				<BaseModalFooter className='d-flex justify-content-end gap-2'>
					<Button type='button' size='xs' secondary onClick={handleOnClose}>
						<FormattedMessage id='button.close' />
					</Button>
					<Button type='submit' size='xs' onClick={methods.handleSubmit(handleOnSubmit)}>
						<FormattedMessage id={`button.${linkId ? 'update' : 'add'}`} />
					</Button>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
