import {
	BaseModal,
	BaseModalBody,
	BaseModalFooter,
	BaseModalHeader,
	Button,
	FloatingLabelInput,
	FloatingLabelSelect,
} from '@/admin/components';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { adminDefaultValues, adminValidation } from '../../validation';

export function AdminCreateModal({
	isOpen = false,
	genders = [],
	positions = [],
	onSubmit = () => null,
	onClose = () => false,
}) {
	const methods = useForm({
		mode: 'onChange',
		defaultValues: adminDefaultValues,
		resolver: yupResolver(adminValidation),
	});

	const handleOnClose = () => {
		methods.reset();
		onClose();
	};

	return (
		<FormProvider {...methods}>
			<BaseModal isOpen={isOpen} onClose={onClose}>
				<BaseModalHeader idIntl='dashboard.admin.modal.create_admin.title' onClose={handleOnClose} />
				<form onSubmit={methods.handleSubmit(onSubmit)}>
					<BaseModalBody>
						<div className='row'>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='first_name' labelIntl='form.first_name' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='last_name' labelIntl='form.last_name' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='email' labelIntl='form.email' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='phone' labelIntl='form.phone' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='address' labelIntl='form.address' />
							</div>
							<div className='col-6 mb-6 z-index-4'>
								<FloatingLabelSelect name='genderId' labelIntl='common.gender' options={genders} />
							</div>

							<div className='col-6 mb-6 z-index-2'>
								<FloatingLabelSelect
									name='positionId'
									labelIntl='common.position'
									options={positions}
									autoComplete='positionId'
								/>
							</div>
						</div>
					</BaseModalBody>
					<BaseModalFooter className='d-flex justify-content-end gap-2'>
						<Button type='button' size='sm' secondary onClick={handleOnClose}>
							<FormattedMessage id='button.close' />
						</Button>
						<Button type='submit' size='sm' info>
							<FormattedMessage id='button.create' />
						</Button>
					</BaseModalFooter>
				</form>
			</BaseModal>
		</FormProvider>
	);
}
