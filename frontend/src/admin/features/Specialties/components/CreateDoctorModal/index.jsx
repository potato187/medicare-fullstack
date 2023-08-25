import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
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
import { doctorDefaultValues, doctorValidation } from '../../validation';

export function CreateDoctorModal({
	isOpen = false,
	specialties = [],
	positions = [],
	genders = [],
	onSubmit = () => null,
	onClose = () => false,
}) {
	const methods = useForm({
		mode: 'onChange',
		defaultValues: doctorDefaultValues,
		resolver: yupResolver(doctorValidation),
	});

	const handleOnClose = () => {
		onClose();
		methods.reset();
	};

	return (
		<FormProvider {...methods}>
			<BaseModal size='lg' isOpen={isOpen} onClose={onClose}>
				<BaseModalHeader idIntl='dashboard.specialty.modal.create_doctor.title' onClose={handleOnClose} />
				<BaseModalBody>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<Tabs className='tabs' tabIndexActive={0}>
							<TabNav>
								<TabNavItem labelIntl='form.profile' tabIndex={0} />
								<TabNavItem labelIntl='common.description_en' index={1} />
								<TabNavItem labelIntl='common.description_vi' index={2} />
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
										<FloatingLabelSelect name='genderId' labelIntl='form.gender' options={genders} />
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
					<Button type='button' size='sm' secondary onClick={handleOnClose}>
						<FormattedMessage id='button.close' />
					</Button>
					<Button
						isLoading={methods.formState.isSubmitting}
						type='submit'
						size='sm'
						onClick={methods.handleSubmit(onSubmit)}
					>
						<FormattedMessage id='button.create' />
					</Button>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
