import { yupResolver } from '@hookform/resolvers/yup';
import { setDefaultValues } from 'admin/utilities';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { resourceApi } from 'admin/api';
import {
	BaseModal,
	BaseModalBody,
	BaseModalFooter,
	BaseModalHeader,
	Button,
	FloatingDatePicker,
	FloatingLabelInput,
	FloatingLabelSelect,
	TextArea,
} from 'admin/components';
import { bookingValidation } from '../../validation';

export function BookingModel({
	idTitleIntl = '',
	isOpen = false,
	booking,
	specialtyId = '',
	specialties = [],
	workingHours = [],
	statuses = [],
	genders = [],
	onClose = () => false,
	onSubmit = () => null,
}) {
	const methods = useForm({
		mode: 'onChange',
		resolver: yupResolver(bookingValidation),
	});

	const [doctors, setDoctors] = useState([]);

	const watchSpecialtyId = methods.watch('specialtyId', specialtyId);

	useEffect(() => {
		if (isOpen && booking) {
			setDefaultValues(methods, booking);
			methods.setValue('specialtyId', specialtyId);
		}
	}, [isOpen, booking, specialtyId, methods]);

	useEffect(() => {
		(async () => {
			if (watchSpecialtyId) {
				const { metadata } = await resourceApi.getAll('doctor', {
					specialtyId: watchSpecialtyId,
					select: ['_id', 'firstName', 'lastName'],
				});

				const doctors = metadata.map(({ _id, firstName, lastName }) => ({
					label: `${lastName} ${firstName}`,
					value: _id,
				}));

				setDoctors(doctors);
			}
		})();
	}, [watchSpecialtyId]);

	useEffect(() => {
		(() => {
			const doctorId = doctors.length ? doctors[0].value : '';
			methods.setValue('doctorId', doctorId, { shouldValidate: !!doctorId });
		})();
	}, [watchSpecialtyId, doctors, methods]);

	return (
		<FormProvider {...methods}>
			<BaseModal size='md' isOpen={isOpen}>
				<BaseModalHeader idIntl={idTitleIntl} onClose={onClose} />
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<div className='row'>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='fullName' labelIntl='form.fullName' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='phone' labelIntl='form.phone' />
							</div>
							<div className='col-6 mb-6'>
								<FloatingLabelInput name='address' labelIntl='form.address' />
							</div>
							<div className='col-6 mb-6 position-relative z-index-5'>
								<FloatingDatePicker name='dateOfBirth' labelIntl='common.dateOfBirth' />
							</div>
							<div className='col-6 mb-6 position-relative z-index-5'>
								<FloatingLabelSelect name='gender' labelIntl='common.gender' options={genders} />
							</div>
							<div className='col-6 mb-6 position-relative z-index-4'>
								<FloatingLabelSelect name='status' labelIntl='common.status' options={statuses} />
							</div>
							<div className='col-6 mb-6 position-relative z-index-3'>
								<FloatingDatePicker name='appointmentDate' labelIntl='common.appointmentDate' />
							</div>
							<div className='col-6 mb-6 position-relative z-index-3'>
								<FloatingLabelSelect name='workingHourId' labelIntl='common.booking' options={workingHours} />
							</div>

							<div className='col-6 mb-6 z-index-2'>
								<FloatingLabelSelect
									showCounter
									name='specialtyId'
									labelIntl='common.specialty'
									options={specialties}
								/>
							</div>
							<div className='col-6 mb-6 position-relative z-index-2'>
								<FloatingLabelSelect
									name='doctorId'
									labelIntl='common.doctor'
									value={booking.doctorId}
									options={doctors}
									disabled={!doctors.length}
								/>
							</div>
							<div className='col-12 position-relative z-index-1'>
								<TextArea labelIntl='common.note' name='description' rows={5} />
							</div>
						</div>
					</form>
				</BaseModalBody>
				<BaseModalFooter className='d-flex justify-content-end  align-items-center gap-2'>
					<Button size='xs' type='button' secondary onClick={onClose}>
						<FormattedMessage id='button.cancel' />
					</Button>
					<Button size='xs' type='submit' info onClick={methods.handleSubmit(onSubmit)}>
						<FormattedMessage id='button.update' />
					</Button>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
