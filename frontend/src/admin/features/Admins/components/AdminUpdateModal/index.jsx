import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { setDefaultValues } from 'admin/utilities';
import {
	BaseModal,
	BaseModalBody,
	BaseModalFooter,
	BaseModalHeader,
	Button,
	FloatingLabelInput,
	FloatingLabelSelect,
} from 'admin/components';
import { adminValidation } from '../../validation';

export function AdminUpdateModal({
	isOpen = false,
	admin,
	genders = [],
	positions = [],
	onSubmit = () => null,
	onClose = () => false,
}) {
	const methods = useForm({
		mode: 'onChange',
		resolver: yupResolver(adminValidation),
	});

	const handleOnClose = () => {
		methods.clearErrors();
		onClose();
	};

	useEffect(() => {
		if (isOpen && admin) {
			setDefaultValues(methods, admin);
		}
	}, [isOpen, admin, methods]);

	return (
		<FormProvider {...methods}>
			<BaseModal isOpen={isOpen} onClose={handleOnClose}>
				<BaseModalHeader idIntl='dashboard.admin.modal.update_admin.title' onClose={handleOnClose} />
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
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
						</div>
					</form>
				</BaseModalBody>
				<BaseModalFooter className='d-flex justify-content-end gap-2'>
					<Button size='xs' type='button' secondary onClick={handleOnClose}>
						<FormattedMessage id='button.cancel' />
					</Button>
					<Button size='xs' info onClick={methods.handleSubmit(onSubmit)}>
						<FormattedMessage id='button.update' />
					</Button>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
