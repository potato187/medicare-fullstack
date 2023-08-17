import { Card, CardBody, Button, FormInputController, FormPasswordController } from '@/admin/components';
import { FormattedMessage } from 'react-intl';

export function LoginForm({ onSubmit, isLoading }) {
	return (
		<Card className='shadow-sm'>
			<CardBody>
				<div className='text-center'>
					<h5 className='text-size-md fw-bold mb-2 text-primary text-uppercase'>welcome back</h5>
					<p className='text-size-sm fw-medium text-gray-600 mb-3'>Sign in to continue to Velzon.</p>
					<form onSubmit={onSubmit}>
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
								<Button type='submit' size='sm' isLoading={isLoading}>
									<FormattedMessage id='button.login' />
								</Button>
							</div>
						</div>
					</form>
				</div>
			</CardBody>
		</Card>
	);
}
