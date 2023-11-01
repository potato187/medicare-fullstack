import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardBody, FormInputController, FormPasswordController } from 'components';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { defaultValues, schema } from './schema';

export function LoginForm({ onSubmit }) {
	const methods = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema),
	});

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Card className='shadow-sm'>
					<CardBody>
						<div className='text-center'>
							<h5 className='text-size-md fw-bold mb-2 text-primary text-uppercase'>
								<FormattedMessage id='login.title' />
							</h5>
							<p className='text-size-sm fw-medium text-gray-600 mb-3'>
								<FormattedMessage id='login.content' />
							</p>
							<div className='row'>
								<div className='mb-5'>
									<FormInputController
										type='email'
										name='email'
										labelInt='form.email'
										placeholderInt='form.email_placeholder'
									/>
								</div>
								<div className='mb-5'>
									<FormPasswordController
										autoComplete='on'
										name='password'
										labelInt='form.password'
										placeholderInt='form.password_placeholder'
									/>
								</div>
								<div>
									<Button type='submit' size='sm' onClick={methods.handleSubmit(onSubmit)}>
										<FormattedMessage id='button.login' />
									</Button>
								</div>
							</div>
						</div>
					</CardBody>
				</Card>
			</form>
		</FormProvider>
	);
}
