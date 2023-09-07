import { BaseDropdown, DropdownBody, DropdownHeader } from 'admin/components/BaseUI';
import { DATE_FORMAT_QUERY, localeDatePicker } from 'admin/constant';
import cn from 'classnames';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import module from './style.module.scss';
import { DatePickerInput } from './DatePickerInput';

export function DatePickerRange({ languageId = 'en', startDate, endDate = null, className, ...props }) {
	const sDate = moment(startDate).toDate();
	const eDate = endDate ? moment(endDate).toDate() : null;
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
						maxDate={maxDate.toDate()}
						formatDate={DATE_FORMAT_QUERY}
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
