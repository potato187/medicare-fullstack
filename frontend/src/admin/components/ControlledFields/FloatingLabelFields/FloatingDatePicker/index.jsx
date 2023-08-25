import classNames from 'classnames';
import React, { useId } from 'react';
import DatePicker from 'react-datepicker';
import { Controller, useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import module from '../style.module.scss';

const InputDatePicker = React.forwardRef((props, ref) => {
	const domIt = useId();
	const { labelIntl, ...rest } = props;
	const { 'form-group': formGroupCln, 'form-label': labelCln, 'form-control': inputCln } = module;

	return (
		<div className={formGroupCln}>
			<input {...rest} className={classNames(inputCln, 'w-full')} ref={ref} id={domIt} />
			<label htmlFor={domIt} className={labelCln}>
				<FormattedMessage id={labelIntl} />
			</label>
		</div>
	);
});

export function FloatingDatePicker({ name, labelIntl }) {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<DatePicker
					locale='en'
					wrapperClassName='date-picker date-picker-input'
					calendarClassName='date-picker'
					dateFormat='dd/MM/yyyy'
					onChange={(date) => field.onChange(date)}
					selected={field.value}
					customInput={<InputDatePicker labelIntl={labelIntl} />}
				/>
			)}
		/>
	);
}
