import { yupResolver } from '@hookform/resolvers/yup';
import { getObjectDiff, setDefaultValues, tryCatch } from 'admin/utilities';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { bookingApi, resourceApi } from 'admin/api';
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
import { bookingDefaultValues, bookingValidation } from '../../validation';

export function BookingModal({
	isOpen = false,
	bookingId,
	specialties = [],
	workingHours = [],
	statuses = [],
	genders = [],
	onClose = (f) => f,
	onSubmit = (f) => f,
}) {
	const [doctors, setDoctors] = useState([]);
	const clone = useRef(null);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: bookingDefaultValues,
		resolver: yupResolver(bookingValidation),
	});

	const watchSpecialtyId = methods.watch('specialtyId', '');

	const handleOnSubmit = (data) => {
		onSubmit({ _id: bookingId, ...getObjectDiff(clone.current, data) });
	};

	useEffect(() => {
		if (isOpen && bookingId) {
			tryCatch(async () => {
				const { metadata } = await bookingApi.getOneById(bookingId);
				setDefaultValues(methods, metadata);
				clone.current = { ...metadata };
			})();
		}

		if (!isOpen || !bookingId) {
			clone.current = null;
		}
	}, [isOpen, bookingId, methods]);

	useEffect(() => {
		tryCatch(async () => {
			if (watchSpecialtyId) {
				const { metadata } = await resourceApi.getAll({
					model: 'doctor',
					params: {
						specialtyId: watchSpecialtyId,
						select: ['_id', 'firstName', 'lastName'],
					},
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
		if (doctors.length) {
			const doctorId = doctors.length ? doctors[0].value : '';
			methods.setValue('doctorId', doctorId, { shouldValidate: !!doctorId });
		}
	}, [watchSpecialtyId, doctors, methods]);

	return (
		<FormProvider {...methods}>
			<BaseModal size='md' isOpen={isOpen}>
				<BaseModalHeader idIntl='dashboard.booking.modal.update_booking.title' onClose={onClose} />
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(handleOnSubmit)}>
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
					<Button size='xs' type='submit' info onClick={methods.handleSubmit(handleOnSubmit)}>
						<FormattedMessage id='button.update' />
					</Button>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
