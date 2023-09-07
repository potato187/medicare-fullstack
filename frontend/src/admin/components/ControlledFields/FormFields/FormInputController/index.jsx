import { ErrorMessage } from '@hookform/error-message';
import React, { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { FormattedDescription } from 'admin/components/BaseUI';
import module from '../style/style.module.scss';

export function FormInputController({ name, labelInt, placeholderInt, required = false, ...props }) {
	const id = useId();
	const intl = useIntl();
	const label = intl.formatMessage({ id: labelInt });
	const placeholder = placeholderInt ? intl.formatMessage({ id: placeholderInt }) : '';
	const { 'form-group': formCln, 'form-helper': helperCln } = module;
	const { control, errors } = useFormContext();

	return (
		<div className={formCln}>
			<Controller
				name={name}
				control={control}
				render={({ field }) => {
					return (
						<>
							<label htmlFor={id}>
								{label}
								{required ? <span className='text-danger fw-500 fz-xs ml-1'>*</span> : null}
							</label>
							<input type='text' id={id} {...field} {...props} placeholder={placeholder} />
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
