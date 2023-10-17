import cn from 'classnames';
import { MdSearch } from 'react-icons/md';
import { useIntl } from 'react-intl';
import { debounce } from 'utils';
import module from './style.module.scss';

export function UnFieldDebounce({ className, placeholderIntl, initialValue = '', onChange = (f) => f, ...props }) {
	const intl = useIntl();
	const { 'field-debounce': fieldCln, 'field-debounce__icon': iconCln } = module;

	return (
		<div className={cn(fieldCln, className)}>
			<input
				defaultValue={initialValue}
				onChange={debounce((event) => onChange(event.target.value))}
				placeholder={intl.formatMessage({ id: placeholderIntl })}
				{...props}
			/>
			<span className={iconCln}>
				<MdSearch size='1.5em' />
			</span>
		</div>
	);
}
