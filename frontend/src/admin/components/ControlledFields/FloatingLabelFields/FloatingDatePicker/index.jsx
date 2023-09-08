import classNames from 'classnames';
import React, { useId } from 'react';
import DatePicker from 'react-datepicker';
import { Controller, useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { DATE_FORMAT_ISO } from 'admin/constant';
import module from '../style.module.scss';

const InputDatePicker = React.forwardRef((props, ref) => {
	const domIt = useId();
	const { labelIntl, ...restProps } = props;
	const { 'form-group': formGroupCln, 'form-label': labelCln, 'form-control': inputCln } = module;

	return (
		<div className={formGroupCln}>
			<input {...restProps} className={classNames(inputCln, 'w-full')} ref={ref} id={domIt} />
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
					dateFormat={DATE_FORMAT_ISO}
					onChange={(date) => field.onChange(date)}
					selected={new Date(field.value)}
					customInput={<InputDatePicker labelIntl={labelIntl} />}
				/>
			)}
		/>
	);
}
