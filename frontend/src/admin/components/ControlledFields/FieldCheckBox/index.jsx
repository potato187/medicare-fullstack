import React, { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

export function FieldCheckBox({ labelIntl, name }) {
	const domId = useId();
	const { control } = useFormContext();

	return (
		<label className='field-input-check' htmlFor={domId}>
			<Controller
				control={control}
				name={name}
				defaultValue=' '
				render={({ field }) => (
					<input
						id={domId}
						checked={field.value}
						type='checkbox'
						{...field}
						onChange={(e) => {
							field.onChange(!!e.target.checked);
						}}
					/>
				)}
			/>
			{labelIntl ? (
				<span>
					<FormattedMessage id={labelIntl} />
				</span>
			) : null}
		</label>
	);
}
