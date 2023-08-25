import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { setDefaultValues } from 'admin/utilities';
import { useQuery } from 'admin/hooks';
import {
	BaseModal,
	BaseModalBody,
	BaseModalFooter,
	BaseModalHeader,
	Button,
	FloatingLabelInput,
	FloatingLabelSelect,
	TextArea,
} from 'admin/components';
import { bookingValidation } from '../../validation';

export function BookingModel({
	idTitleIntl = '',
	isOpen = false,
	defaultValues = {},
	specialtyId = '',
	specialties = [],
	workingHours = [],
	statuses = [],
	onClose = () => false,
	onSubmit = () => null,
}) {
	const methods = useForm({
		mode: 'onChange',
		resolver: yupResolver(bookingValidation),
	});

	const watchSpecialtyId = methods.watch('specialtyId', specialtyId);

	const handleOnClose = () => {
		methods.reset();
		onClose();
	};

	const { doctors } = useQuery(
		'doctors',
		{
			from: 'doctor',
			where: [`specialtyId=${watchSpecialtyId}`],
			attributes: ['id', 'last_name', 'first_name'],
			sort: [['positionId', 'asc']],
		},
		(response) => {
			return response.map((response) => ({
				value: response.id,
				label: `${response.last_name} ${response.first_name}`,
			}));
		},
		[watchSpecialtyId],
	);

	useEffect(() => {
		setDefaultValues(methods, defaultValues);
		methods.setValue('specialtyId', specialtyId);
	}, [defaultValues, specialtyId, methods]);

	return (
		<FormProvider {...methods}>
			<BaseModal size='md' isOpen={isOpen}>
				<BaseModalHeader idIntl={idTitleIntl} onClose={handleOnClose} />
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<div className='row'>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='fullName' labelIntl='form.fullName' />
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
							<div className='col-6 mb-6 z-index-5'>
								<FloatingLabelSelect
									showCounter
									name='specialtyId'
									labelIntl='common.specialty'
									options={specialties}
								/>
							</div>
							<div className='col-6 mb-6 position-relative z-index-4'>
								<FloatingLabelSelect name='doctorId' labelIntl='common.doctor' options={doctors} />
							</div>
							<div className='col-6 mb-6 position-relative z-index-3'>
								<FloatingLabelSelect name='workingHourId' labelIntl='common.booking' options={workingHours} />
							</div>
							<div className='col-6 mb-6 position-relative z-index-2'>
								<FloatingLabelSelect name='statusId' labelIntl='common.status' options={statuses} />
							</div>
							<div className='col-12 position-relative z-index-1'>
								<TextArea labelIntl='common.note' name='description' rows={5} />
							</div>
						</div>
					</form>
				</BaseModalBody>
				<BaseModalFooter className='d-flex justify-content-end  align-items-center gap-2'>
					<Button size='xs' type='button' secondary onClick={handleOnClose}>
						<FormattedMessage id='button.cancel' />
					</Button>
					<Button
						isLoading={methods.formState.isSubmitting}
						size='xs'
						type='submit'
						info
						onClick={methods.handleSubmit(onSubmit)}
					>
						<FormattedMessage id='button.update' />
					</Button>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
