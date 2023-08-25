import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { doctorApi } from 'admin/api';
import {
	BaseModal,
	BaseModalBody,
	BaseModalFooter,
	BaseModalHeader,
	Button,
	FloatingLabelInput,
	FloatingLabelSelect,
	FormInputEditor,
	TabNav,
	TabNavItem,
	TabPanel,
	Tabs,
} from 'admin/components';
import { setDefaultValues, tryCatch } from 'admin/utilities';

import { doctorValidation } from '../../validation';

export function ProfileDoctorModal({
	isOpen = false,
	defaultValues = {},
	genders = [],
	positions = [],
	specialties = [],
	onSubmit = () => null,
	onClose = () => null,
}) {
	const methods = useForm({
		mode: 'onChange',
		resolver: yupResolver(doctorValidation),
	});

	const handleOnClose = () => {
		methods.clearErrors();
		onClose();
	};

	useEffect(() => {
		setDefaultValues(methods, defaultValues);
	}, [defaultValues, methods]);

	useEffect(() => {
		const fetchDescription = async (id) => {
			const { data } = await doctorApi.getDoctorDescription(id);
			Object.entries(data).forEach(([key, value]) => {
				methods.setValue(`description.${key.trim()}`, value);
			});
		};

		if (defaultValues.id) {
			tryCatch(fetchDescription)(defaultValues.id);
		}
	}, [defaultValues.id, methods]);

	return (
		<FormProvider {...methods}>
			<BaseModal size='lg' isOpen={isOpen} onClose={handleOnClose}>
				<BaseModalHeader idIntl='dashboard.specialty.modal.update_doctor.title' onClose={handleOnClose} />
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<Tabs tabIndexActive={0}>
							<TabNav>
								<TabNavItem labelIntl='user.profile' index={0} />
								<TabNavItem labelIntl='user.description.en' index={1} />
								<TabNavItem labelIntl='user.description.vi' index={2} />
							</TabNav>
							<TabPanel tabIndex={0}>
								<div className='row'>
									<div className='col-4 mb-6'>
										<FloatingLabelInput name='first_name' labelIntl='form.first_name' />
									</div>
									<div className='col-4 mb-6'>
										<FloatingLabelInput name='last_name' labelIntl='form.last_name' />
									</div>
									<div className='col-4 mb-6'>
										<FloatingLabelInput name='email' labelIntl='form.email' />
									</div>
									<div className='col-4 mb-6'>
										<FloatingLabelInput name='phone' labelIntl='form.phone' />
									</div>
									<div className='col-4 mb-6'>
										<FloatingLabelInput name='address' labelIntl='form.address' />
									</div>
									<div className='col-4 mb-6 z-index-2'>
										<FloatingLabelSelect name='genderId' labelIntl='common.gender' options={genders} />
									</div>
									<div className='col-4 mb-6 z-index-2'>
										<FloatingLabelSelect name='specialtyId' labelIntl='common.specialty' options={specialties} />
									</div>
									<div className='col-4 mb-6'>
										<FloatingLabelSelect name='positionId' labelIntl='common.position' options={positions} />
									</div>
								</div>
							</TabPanel>
							<TabPanel index={1}>
								<FormInputEditor name='description.en' />
							</TabPanel>
							<TabPanel index={2}>
								<FormInputEditor name='description.vi' />
							</TabPanel>
						</Tabs>
					</form>
				</BaseModalBody>
				<BaseModalFooter className='d-flex justify-content-end gap-2'>
					<Button size='sm' type='button' secondary onClick={handleOnClose}>
						<FormattedMessage id='button.cancel' />
					</Button>
					<Button
						isLoading={methods.formState.isSubmitting}
						size='sm'
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
