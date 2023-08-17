import cn from 'classnames';
import module from './style.module.scss';
import { debounce } from '@/utils';
import { useIntl } from 'react-intl';
import { MdSearch } from 'react-icons/md';

export function UnFieldDebounce({
	className = '',
	initialValue = '',
	delay = 300,
	placeholderIntl,
	onChange = () => null,
	...props
}) {
	const { 'field-debounce': fieldCln, 'field-debounce__icon': iconCln } = module;
	const intl = useIntl();
	const handleOnChange = (event) => {
		onChange(event.target.value);
	};

	return (
		<div className={cn(fieldCln, className)}>
			<input
				defaultValue={initialValue}
				onChange={debounce((event) => handleOnChange(event))}
				placeholder={intl.formatMessage({ id: placeholderIntl })}
				{...props}
			/>
			<span className={iconCln}>
				<MdSearch size='1.5em' />
			</span>
		</div>
	);
}
