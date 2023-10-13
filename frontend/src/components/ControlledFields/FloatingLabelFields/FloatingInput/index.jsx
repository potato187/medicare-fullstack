import { ErrorMessage } from '@hookform/error-message';
import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormattedDescription } from 'components/BaseUI';
import module from '../style.module.scss';

export function FloatingInput({ name, label, type = 'text' }) {
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
					<input type={type} id={id} className={inputCln} placeholder=' ' autoComplete='nope' {...field} />
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
