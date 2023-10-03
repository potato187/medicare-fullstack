import { ErrorMessage } from '@hookform/error-message';
import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormattedDescription } from 'admin/components/BaseUI';
import module from '../style.module.scss';

export function FloatingLabelInput({ name, labelIntl, ...props }) {
	const id = useId();
	const intl = useIntl();
	const labelText = intl.formatMessage({ id: labelIntl });

	const { control, errors } = useFormContext();
	const { 'form-group': formGroupCln, 'form-label': labelCln, 'form-control': inputCln } = module;

	return (
		<div className={formGroupCln}>
			<Controller
				control={control}
				name={name}
				defaultValue=''
				render={({ field }) => (
					<input className={inputCln} placeholder=' ' autoComplete='nope' {...field} {...props} id={id} />
				)}
			/>
			<ErrorMessage
				errors={errors}
				name={name}
				render={({ message }) => (
					<div className='invalid-message'>
						<FormattedDescription id={message} values={{ label: labelText }} />
					</div>
				)}
			/>
			<label htmlFor={id} className={labelCln}>
				<FormattedMessage defaultMessage={labelIntl} defaultValue={labelIntl} id={labelIntl} />
			</label>
		</div>
	);
}
