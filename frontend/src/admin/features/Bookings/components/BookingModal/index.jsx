import { yupResolver } from '@hookform/resolvers/yup';
import { getObjectDiff, setDefaultValues, tryCatch } from 'utils';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { bookingApi, resourceApi } from 'api';
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
} from 'components';
import { defaultValues, schema } from './schema';

export function BookingModal({
	isOpen = false,
	bookingId,
	specialties = [],
	workingHours = [],
	statuses = [],
	genders = [],
	onClose = () => false,
	onSubmit = (f) => f,
}) {
	const [doctors, setDoctors] = useState([]);
	const clone = useRef(null);
	const methods = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema),
	});

	const watchSpecialtyId = methods.watch('specialtyId', '');

	const handleSubmit = (data) => {
		const updateBody = getObjectDiff(clone.current, data);
		onSubmit({ _id: bookingId, ...updateBody });
	};

	useEffect(() => {
		const fetchBookingById = async () => {
			const { metadata } = await bookingApi.getOneById(bookingId);
			setDefaultValues(methods, metadata);
			clone.current = { ...metadata };
		};

		if (isOpen && bookingId) {
			tryCatch(fetchBookingById)();
		}

		if (!isOpen || !bookingId) {
			clone.current = null;
		}
	}, [isOpen, bookingId]);

	useEffect(() => {
		const fetchDoctorsBySpecialtyId = async () => {
			if (!watchSpecialtyId) return;
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
		};
		tryCatch(fetchDoctorsBySpecialtyId)();
	}, [watchSpecialtyId]);

	useEffect(() => {
		const doctorId = doctors.length ? doctors[0].value : '';
		methods.setValue('doctorId', doctorId, { shouldValidate: !!doctorId });
	}, [watchSpecialtyId, doctors]);

	return (
		<FormProvider {...methods}>
			<BaseModal size='md' isOpen={isOpen}>
				<BaseModalHeader idIntl='dashboard.booking.modal.update.title' onClose={onClose} />
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(handleSubmit)}>
						<div className='row'>
							<div className='col-12 col-md-6 mb-6'>
								<FloatingLabelInput name='fullName' labelIntl='form.fullName' />
							</div>
							<div className='col-12 col-md-6 mb-6'>
								<FloatingLabelInput name='phone' labelIntl='form.phone' />
							</div>
							<div className='col-12 col-md-6 mb-6'>
								<FloatingLabelInput name='address' labelIntl='form.address' />
							</div>
							<div className='col-12 col-md-6 mb-6 position-relative z-index-5'>
								<FloatingDatePicker name='dateOfBirth' labelIntl='common.dateOfBirth' />
							</div>
							<div className='col-12 col-md-6 mb-6 position-relative z-index-5'>
								<FloatingLabelSelect name='gender' labelIntl='common.gender' options={genders} />
							</div>
							<div className='col-12 col-md-6 mb-6 position-relative z-index-4'>
								<FloatingLabelSelect name='status' labelIntl='common.status' options={statuses} />
							</div>

							<div className='col-12 col-md-6 mb-6 position-relative z-index-3'>
								<FloatingDatePicker name='appointmentDate' labelIntl='common.appointmentDate' />
							</div>
							<div className='col-12 col-md-6 mb-6 position-relative z-index-3'>
								<FloatingLabelSelect name='workingHourId' labelIntl='common.booking' options={workingHours} />
							</div>

							<div className='col-12 col-md-6 mb-6 z-index-2'>
								<FloatingLabelSelect
									showCounter
									name='specialtyId'
									labelIntl='common.specialty'
									options={specialties}
								/>
							</div>
							<div className='col-12 col-md-6 mb-6 position-relative z-index-2'>
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
					<Button size='xs' type='submit' info onClick={methods.handleSubmit(handleSubmit)}>
						<FormattedMessage id='button.update' />
					</Button>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
