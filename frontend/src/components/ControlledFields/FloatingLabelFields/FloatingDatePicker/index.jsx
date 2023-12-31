import { DATE_FORMAT } from 'constant';
import classNames from 'classnames';
import moment from 'moment';
import React, { useId } from 'react';
import DatePicker from 'react-datepicker';
import { Controller, useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import module from '../style.module.scss';

const InputDatePicker = React.forwardRef((props, ref) => {
	const domIt = useId();
	const { labelIntl, ...restProps } = props;
	const { 'form-group': formGroupCln, 'form-label': labelCln, 'form-control': inputCln } = module;

	return (
		<div className={formGroupCln}>
			<input type='text' {...restProps} className={classNames(inputCln, 'w-full')} id={domIt} ref={ref} />
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
			defaultValue=' '
			render={({ field: { value: date, ...restField } }) => (
				<DatePicker
					locale='en'
					wrapperClassName='date-picker date-picker-input'
					calendarClassName='date-picker'
					selected={new Date(date)}
					value={moment(new Date(date)).format(DATE_FORMAT)}
					{...restField}
					customInput={<InputDatePicker labelIntl={labelIntl} />}
				/>
			)}
		/>
	);
}
