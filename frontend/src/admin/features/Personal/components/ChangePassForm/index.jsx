import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FloatingLabelPassword } from 'components';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { defaultValues, schema } from './schema';

export function ChangePassForm({ onSubmit = (f) => f }) {
	const methods = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema),
	});

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<div className='row'>
					<div className='col-12 col-sm-6 col-lg-4 mb-6'>
						<FloatingLabelPassword name='password' labelIntl='form.password' />
					</div>
					<div className='col-12 col-sm-6 col-lg-4 mb-6'>
						<FloatingLabelPassword name='confirm_password' labelIntl='form.confirm_password' />
					</div>
					<div className='col-12 col-sm-6 col-lg-4 mb-6'>
						<FloatingLabelPassword name='newPassword' labelIntl='form.new_password' />
					</div>
					<div className='col-12 text-start pt-1'>
						<Button size='xs' type='submit' onClick={methods.handleSubmit(onSubmit)}>
							<FormattedMessage id='form.change_password' />
						</Button>
					</div>
				</div>
			</form>
		</FormProvider>
	);
}
