import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Button, Card, CardBody, FormInputController, FormPasswordController } from 'admin/components';
import { authLogin } from 'admin/redux/slices/auth';
import { accountDefaultValues, accountValidation } from '../../validation';
import { Layout } from '../../components';

const REDIRECT_TO_DASHBOARD = '../dashboard';

export function LoginPage() {
	const { status } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const methods = useForm({
		mode: 'onChange',
		defaultValues: accountDefaultValues,
		resolver: yupResolver(accountValidation),
	});

	const onSubmit = (data) => {
		dispatch(authLogin(data));
	};

	if (status.isLogin) {
		return <Navigate to={REDIRECT_TO_DASHBOARD} />;
	}

	return (
		<FormProvider {...methods}>
			<Layout>
				<form onSubmit={methods.handleSubmit(onSubmit)}>
					<Card className='shadow-sm'>
						<CardBody>
							<div className='text-center'>
								<h5 className='text-size-md fw-bold mb-2 text-primary text-uppercase'>welcome back</h5>
								<p className='text-size-sm fw-medium text-gray-600 mb-3'>Sign in to continue to Medicare.</p>
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
										<Button
											type='submit'
											size='sm'
											isLoading={methods.formState.isLoading}
											onClick={methods.handleSubmit(onSubmit)}
										>
											<FormattedMessage id='button.login' />
										</Button>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</form>
			</Layout>
		</FormProvider>
	);
}
