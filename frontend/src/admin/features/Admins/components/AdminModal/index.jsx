import { yupResolver } from '@hookform/resolvers/yup';
import { adminApi } from 'api';
import {
	BaseModal,
	BaseModalBody,
	BaseModalFooter,
	BaseModalHeader,
	Button,
	FloatingLabelInput,
	FloatingLabelPassword,
	FloatingLabelSelect,
} from 'components';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { getObjectDiff, setDefaultValues, tryCatch } from 'utils';
import { adminDefaultValues, createAdminSchema, updateAdminSchema } from './schema';

export function AdminModal({
	isOpen = false,
	adminId,
	genders = [],
	positions = [],
	onClose = (f) => f,
	onCreate = (f) => f,
	onUpdate = (f) => f,
}) {
	const schema = adminId ? updateAdminSchema : createAdminSchema;
	const methods = useForm({
		mode: 'onChange',
		defaultValues: adminDefaultValues,
		resolver: yupResolver(schema),
	});

	const clone = useRef(null);

	const handleOnClose = () => {
		methods.reset();
		onClose();
	};

	const handleOnSubmit = (data) => {
		if (adminId) {
			onUpdate(getObjectDiff(clone.current, data));
		} else {
			onCreate(data);
		}
	};

	useEffect(() => {
		if (isOpen && adminId) {
			tryCatch(async () => {
				const { metadata } = await adminApi.getOneById(adminId);
				setDefaultValues(methods, metadata);
				clone.current = metadata;
			})();
		} else {
			clone.current = null;
		}
	}, [isOpen, adminId]);

	return (
		<FormProvider {...methods}>
			<BaseModal isOpen={isOpen} onClose={handleOnClose}>
				<BaseModalHeader
					idIntl={`dashboard.admin.modal.${adminId ? 'update' : 'create'}.title`}
					onClose={handleOnClose}
				/>
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(handleOnSubmit)}>
						<div className='row'>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='firstName' labelIntl='form.firstName' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='lastName' labelIntl='form.lastName' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='email' labelIntl='form.email' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='phone' labelIntl='form.phone' />
							</div>
							<div className='col-6 mb-6 z-index-2'>
								<FloatingLabelSelect name='gender' labelIntl='common.gender' options={genders} />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelSelect name='role' labelIntl='common.position' options={positions} />
							</div>
							{!adminId ? (
								<div className='col-6 mb-6'>
									<FloatingLabelPassword name='password' labelIntl='form.password' />
								</div>
							) : null}
						</div>
					</form>
				</BaseModalBody>
				<BaseModalFooter className='d-flex justify-content-end gap-2'>
					<Button size='xs' type='button' secondary onClick={handleOnClose}>
						<FormattedMessage id='button.cancel' />
					</Button>
					<Button size='xs' info onClick={methods.handleSubmit(handleOnSubmit)}>
						<FormattedMessage id={`button.${adminId ? 'update' : 'add'}`} />
					</Button>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
