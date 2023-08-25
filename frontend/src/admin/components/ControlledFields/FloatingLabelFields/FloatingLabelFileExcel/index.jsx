import { ErrorMessage } from '@hookform/error-message';
import React, { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import module from '../style.module.scss';

export function FloatingLabelFileExcel({ name, labelIntl, onSubmit = () => null }) {
	const id = useId();
	const { control, errors, handleSubmit } = useFormContext();
	const { 'form-group': formGroupCln, 'form-label': labelCln, 'form-control': inputCln } = module;

	return (
		<div className={formGroupCln}>
			<Controller
				control={control}
				name={name}
				render={({ field }) => (
					<input
						id={id}
						className={inputCln}
						type='file'
						placeholder=' '
						autoComplete='nope'
						onChange={(e) => {
							field.onChange(e.target.files[0] ?? null);
							handleSubmit(onSubmit)();
						}}
						onClick={(event) => {
							event.target.value = null;
						}}
					/>
				)}
			/>
			<ErrorMessage
				errors={errors}
				name={name}
				render={({ message }) => <div className='invalid-message'>{message}</div>}
			/>
			<label htmlFor={id} className={labelCln}>
				<FormattedMessage id={labelIntl} />
			</label>
		</div>
	);
}
