import { useSwitchState } from '@/hooks';
import { ErrorMessage } from '@hookform/error-message';
import React, { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import module from './style.module.scss';
import { useIntl } from 'react-intl';
import { FormattedDescription } from '@/shared/components';

export function FormPasswordController({ name, labelInt, placeholderInt, ...props }) {
	const id = useId();
	const intl = useIntl();
	const label = intl.formatMessage({ id: labelInt });
	const placeholder = intl.formatMessage({ id: placeholderInt });
	const { control, errors } = useFormContext();
	const { isOpen: hidden, toggle: setHidden } = useSwitchState();
	const { 'form-group': formCln, 'form-group__password': passwordCln, 'form-helper': helperCln } = module;

	return (
		<div className={formCln}>
			<Controller
				name={name}
				control={control}
				render={({ field }) => {
					return (
						<React.Fragment>
							<label htmlFor={id}>{label}</label>
							<div className={passwordCln}>
								<input id={id} {...field} {...props} type={hidden ? 'text' : 'password'} placeholder={placeholder} />
								<button type='button' onClick={setHidden}>
									{hidden ? <VscEye size='1.125em' /> : <VscEyeClosed size='1.125em' />}
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
						</React.Fragment>
					);
				}}
			/>
		</div>
	);
}
