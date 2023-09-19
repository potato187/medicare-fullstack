import { yupResolver } from '@hookform/resolvers/yup';
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
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { doctorValidation } from '../../validation';
import { doctorDefaultValue } from '../ImportExcelModal/constant';

export function ProfileDoctorModal({
	isOpen = false,
	doctor,
	genders = [],
	positions = [],
	specialties = [],
	onSubmit = () => null,
	onClose = () => null,
}) {
	const methods = useForm({
		mode: 'onChange',
		defaultValues: doctorDefaultValue,
		resolver: yupResolver(doctorValidation),
	});

	const handleOnClose = () => {
		methods.clearErrors();
		onClose();
	};

	const handleOnSubmit = (data) => {
		onSubmit({ id: doctor._id, data });
	};

	useEffect(() => {
		if (isOpen && doctor) {
			setDefaultValues(methods, doctor);
		}
	}, [isOpen, doctor, methods]);

	useEffect(() => {
		tryCatch(async () => {
			if (isOpen && doctor?._id) {
				const { metadata } = await doctorApi.getOne({
					id: doctor._id,
					params: {
						select: ['description'],
					},
				});

				if (metadata?.description) {
					const { description } = metadata;
					Object.keys(description).forEach((key) => {
						methods.setValue(`description.${key}`, description[key], {
							shouldDirty: false,
							shouldTouch: false,
						});
					});
				}
			}
		})();
	}, [isOpen, doctor, methods]);

	return (
		<FormProvider {...methods}>
			<BaseModal size='lg' isOpen={isOpen} onClose={handleOnClose}>
				<BaseModalHeader idIntl='dashboard.specialty.modal.update_doctor.title' onClose={handleOnClose} />
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(handleOnSubmit)}>
						<Tabs tabIndexActive={0}>
							<TabNav>
								<TabNavItem labelIntl='common.profile' index={0} />
								<TabNavItem labelIntl='common.description.en' index={1} />
								<TabNavItem labelIntl='common.description.vi' index={2} />
							</TabNav>
							<TabPanel tabPanelIndex={0}>
								<div className='row'>
									<div className='col-4 mb-6'>
										<FloatingLabelInput name='firstName' labelIntl='form.firstName' />
									</div>
									<div className='col-4 mb-6'>
										<FloatingLabelInput name='lastName' labelIntl='form.lastName' />
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
										<FloatingLabelSelect name='gender' labelIntl='common.gender' options={genders} />
									</div>
									<div className='col-4 mb-6 z-index-2'>
										<FloatingLabelSelect name='specialtyId' labelIntl='common.specialty' options={specialties} />
									</div>
									<div className='col-4 mb-6'>
										<FloatingLabelSelect name='position' labelIntl='common.position' options={positions} />
									</div>
								</div>
							</TabPanel>
							<TabPanel tabPanelIndex={1}>
								<FormInputEditor name='description.en' />
							</TabPanel>
							<TabPanel tabPanelIndex={2}>
								<FormInputEditor name='description.vi' />
							</TabPanel>
						</Tabs>
					</form>
				</BaseModalBody>
				<BaseModalFooter className='d-flex justify-content-end gap-2'>
					<Button size='xs' type='button' secondary onClick={handleOnClose}>
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
