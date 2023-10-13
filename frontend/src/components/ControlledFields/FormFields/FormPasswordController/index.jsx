import { ErrorMessage } from '@hookform/error-message';
import { FormattedDescription } from 'components/BaseUI';
import { useToggle } from 'hooks';
import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { useIntl } from 'react-intl';
import module from '../style/style.module.scss';

export function FormPasswordController({ name, labelInt, placeholderInt, ...props }) {
	const id = useId();
	const intl = useIntl();
	const label = intl.formatMessage({ id: labelInt });
	const placeholder = intl.formatMessage({ id: placeholderInt });
	const { control, errors } = useFormContext();
	const [isOpen, toggle] = useToggle();
	const { 'form-group': formCln, 'form-group__password': passwordCln, 'form-helper': helperCln } = module;

	return (
		<div className={formCln}>
			<Controller
				name={name}
				control={control}
				render={({ field }) => {
					return (
						<>
							<label htmlFor={id}>{label}</label>
							<div className={passwordCln}>
								<input id={id} {...field} {...props} type={isOpen ? 'text' : 'password'} placeholder={placeholder} />
								<button type='button' onClick={toggle}>
									{isOpen ? <VscEye size='1.125em' /> : <VscEyeClosed size='1.125em' />}
								</button>
							</div>
							<ErrorMessage
								errors={errors}
								name={name}
								render={({ message }) => (
									<div className={helperCln}>
										<FormattedDescription id={message} values={{ label }} />
									</div>
								)}
							/>
						</>
					);
				}}
			/>
		</div>
	);
}
