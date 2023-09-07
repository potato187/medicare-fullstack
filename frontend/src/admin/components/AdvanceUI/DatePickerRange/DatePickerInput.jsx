import { useDropdown } from 'admin/components/BaseUI';
import cn from 'classnames';
import { formatDateToDDMMYYYY } from 'utils';
import module from './style.module.scss';

export function DatePickerInput({ startDate, endDate = null }) {
	const { isOpen } = useDropdown();
	const { 'date-picker__input': inputCln, focus: focusCln } = module;
	const classNames = cn(inputCln, { [focusCln]: isOpen });
	return (
		<div className={classNames}>
			{formatDateToDDMMYYYY(startDate)}
			{endDate ? (
				<>
					<span className='text-muted'>-</span>
					<span>{formatDateToDDMMYYYY(endDate)}</span>
				</>
			) : (
				<span className='text-muted'> --/--/-- </span>
			)}
		</div>
	);
}
