import { BaseDropdown, DropdownBody, DropdownHeader, DropdownItem } from '@/shared/components/BaseDropdown';
import cn from 'classnames';
import { RxCaretDown } from 'react-icons/rx';
import { FormattedMessage, useIntl } from 'react-intl';

export function DropdownIntl({ name = '', options = [], value = '', className = '', size = '', onSelect = () => {} }) {
	if (!options.length) return null;

	const intl = useIntl();
	const option = options.find((option) => option.value === value) ?? options[0];

	const styles = cn(
		'dropdown',
		{
			'dropdown--sm': size === 'sm',
			'dropdown--md': size === 'md',
		},
		className,
	);

	return (
		<BaseDropdown>
			<div className={styles}>
				<DropdownHeader className='dropdown__header'>
					<span className='no-wrap-ellipsis'>
						<FormattedMessage id={option.label} />
					</span>
					<RxCaretDown size='1.5em' />
				</DropdownHeader>
				<DropdownBody className='dropdown__list'>
					<ul>
						{options.map((item, index) => (
							<DropdownItem
								type='li'
								key={index}
								className={cn({ active: item.value === option.value })}
								customOnClick={() => onSelect({ key: name, value: item.value })}>
								{intl.formatMessage({ id: item.label })}
							</DropdownItem>
						))}
					</ul>
				</DropdownBody>
			</div>
		</BaseDropdown>
	);
}
