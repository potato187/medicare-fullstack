import { FormattedDescription } from '@/shared/components';
import { ErrorMessage } from '@hookform/error-message';
import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import module from '../style.module.scss';

export function FloatingInput({ name, label, ...props }) {
	const id = useId();
	const { control, errors } = useFormContext();
	const { 'form-group': formGroupCln, 'form-label': labelCln, 'form-control': inputCln } = module;

	return (
		<div className={formGroupCln}>
			<Controller
				control={control}
				name={name}
				defaultValue=''
				render={({ field }) => (
					<input id={id} className={inputCln} {...field} {...props} placeholder=' ' autoComplete='nope' />
				)}
			/>
			<ErrorMessage
				errors={errors}
				name={name}
				render={({ message }) => (
					<div className='invalid-message'>
						<FormattedDescription id={message} values={{ label }} />
					</div>
				)}
			/>
			<label htmlFor={id} className={labelCln}>
				{label}
			</label>
		</div>
	);
}
