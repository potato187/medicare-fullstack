import { yupResolver } from '@hookform/resolvers/yup';
import { adminApi } from 'admin/api';
import { Button, FloatingLabelInput, FloatingLabelSelect } from 'admin/components';
import { getObjectDiff, setDefaultValues, tryCatch } from 'admin/utilities';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { profileDefaultValues, profileSchema } from './schema';

export function ProfileForm({ profileId, genders = [], onSubmit = (f) => f }) {
	const clone = useRef(null);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: profileDefaultValues,
		resolver: yupResolver(profileSchema),
	});

	const handleSubmit = (data) => {
		onSubmit(getObjectDiff(clone.current, data));
	};

	useEffect(() => {
		if (profileId) {
			tryCatch(async () => {
				const { metadata } = await adminApi.getOneById(profileId);
				const { role, ...profile } = metadata;
				clone.current = { ...profile };
				setDefaultValues(methods, profile);
			})();
		}
	}, [profileId, methods]);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(handleSubmit)}>
				<div className='row'>
					<div className='col-4 mb-6'>
						<FloatingLabelInput name='firstName' labelIntl='form.firstName' />
					</div>
					<div className='col-4 mb-6'>
						<FloatingLabelInput name='lastName' labelIntl='form.lastName' />
					</div>
					<div className='col-4 mb-6'>
						<FloatingLabelInput name='phone' labelIntl='form.phone' />
					</div>
					<div className='col-4 mb-6'>
						<FloatingLabelInput name='email' labelIntl='form.email' />
					</div>
					<div className='col-4 mb-6'>
						<FloatingLabelSelect name='gender' labelIntl='form.gender' options={genders} />
					</div>

					<div className='col-12 text-start pt-1'>
						<Button size='xs' type='submit' onClick={methods.handleSubmit(handleSubmit)}>
							<FormattedMessage id='button.update' />
						</Button>
					</div>
				</div>
			</form>
		</FormProvider>
	);
}
