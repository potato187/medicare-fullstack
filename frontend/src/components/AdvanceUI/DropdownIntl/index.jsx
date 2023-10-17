import { BaseDropdown, DropdownBody, DropdownHeader, DropdownItem } from 'components/BaseUI';
import cn from 'classnames';
import { RxCaretDown } from 'react-icons/rx';
import { FormattedMessage, useIntl } from 'react-intl';

export function DropdownIntl({ name = '', options = [], value = '', className = '', size = '', onSelect = () => {} }) {
	const intl = useIntl();
	if (!options.length) return null;
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
					<span className='text-nowrap'>
						<FormattedMessage id={option.label} />
					</span>
					<RxCaretDown size='1.5em' />
				</DropdownHeader>
				<DropdownBody className='dropdown__list'>
					<ul>
						{options.map((item) => (
							<DropdownItem
								type='li'
								key={item.value}
								className={cn({ active: item.value === option.value })}
								customOnClick={() => onSelect({ key: name, value: item.value })}
							>
								{intl.formatMessage({ id: item.label })}
							</DropdownItem>
						))}
					</ul>
				</DropdownBody>
			</div>
		</BaseDropdown>
	);
}
