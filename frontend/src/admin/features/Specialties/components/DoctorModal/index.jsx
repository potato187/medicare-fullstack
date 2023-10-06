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
import { getObjectDiff, setDefaultValues, tryCatch } from 'admin/utilities';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { defaultValues, schema } from './schema';

export function DoctorModal({
	isOpen = false,
	doctorId,
	genders = [],
	positions = [],
	specialties = [],
	onClose = (f) => f,
	onCreate = (f) => f,
	onUpdate = (f) => f,
}) {
	const methods = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema),
	});

	const clone = useRef(null);

	const handleOnClose = () => {
		methods.reset();
		onClose();
	};

	const handleOnSubmit = (data) => {
		if (doctorId) {
			onUpdate({ id: doctorId, data: getObjectDiff(clone.current, data) });
		} else {
			onCreate(data);
		}
	};

	useEffect(() => {
		tryCatch(async () => {
			if (isOpen && doctorId) {
				const { metadata } = await doctorApi.getOne({ id: doctorId });
				if (Object.keys(metadata).length) {
					setDefaultValues(methods, metadata);
					clone.current = { ...metadata };
				}
			}

			if (!isOpen || !doctorId) {
				setDefaultValues(methods, defaultValues);
				clone.current = null;
			}
		})();
	
	}, [isOpen, doctorId]);

	return (
		<FormProvider {...methods}>
			<BaseModal size='lg' isOpen={isOpen} onClose={handleOnClose}>
				<BaseModalHeader
					idIntl={`dashboard.specialty.modal.${doctorId ? 'update' : 'create'}_doctor.title`}
					onClose={handleOnClose}
				/>
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
						<FormattedMessage id={`button.${doctorId ? 'update' : 'create'}`} />
					</Button>
				</BaseModalFooter>
			</BaseModal>
		</FormProvider>
	);
}
