import cn from 'classnames';
import moment from 'moment';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BaseDropdown, DropdownBody, DropdownHeader, useDropdown } from 'admin/components/BaseUI';
import { formatDate } from 'utils';
import { DATE_FORMAT_QUERY, localeDatePicker } from 'admin/constant';
import module from './style.module.scss';

function DatePickerInput({ startDate, endDate = null }) {
	const { isOpen } = useDropdown();
	const { 'date-picker__input': inputCln, focus: focusCln } = module;
	const classNames = cn(inputCln, { [focusCln]: isOpen });
	return (
		<div className={classNames}>
			{formatDate(startDate)}
			{endDate ? (
				<>
					<span className='text-muted'>-</span>
					<span>{formatDate(endDate)}</span>
				</>
			) : (
				<span className='text-muted'> --/--/-- </span>
			)}
		</div>
	);
}

export function DatePickerRange({ languageId = 'en', startDate, endDate = null, className, ...props }) {
	const sDate = moment(startDate, DATE_FORMAT_QUERY).toDate();
	const eDate = endDate ? moment(endDate, DATE_FORMAT_QUERY).toDate() : null;
	const maxDate = moment().add(7, 'days');
	const { 'date-picker': datePickerCln, 'date-picker__calendar': calendarCln } = module;

	return (
		<BaseDropdown>
			<div className={cn(datePickerCln, className)}>
				<DropdownHeader className='h-100'>
					<DatePickerInput startDate={sDate} endDate={eDate} />
				</DropdownHeader>
				<DropdownBody className={calendarCln}>
					<DatePicker
						locale={localeDatePicker[languageId]}
						wrapperClassName='date-picker'
						calendarClassName='date-picker'
						className={cn(className)}
						dateFormat={DATE_FORMAT_QUERY}
						maxDate={maxDate.toDate()}
						selected={sDate}
						startDate={sDate}
						endDate={eDate}
						selectsRange
						inline
						{...props}
					/>
				</DropdownBody>
			</div>
		</BaseDropdown>
	);
}
