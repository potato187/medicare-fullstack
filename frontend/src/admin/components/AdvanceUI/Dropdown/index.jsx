import { BaseDropdown, DropdownBody, DropdownHeader, DropdownItem } from '@/shared/components/BaseDropdown';
import cn from 'classnames';
import { RxCaretDown } from 'react-icons/rx';

export function Dropdown({
	showCounter = false,
	name = '',
	options = [],
	value = '',
	className = '',
	size = '',
	onSelect = () => {},
}) {
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
					<span className='no-wrap-ellipsis'>{option.label}</span>
					<RxCaretDown size='1.5em' />
				</DropdownHeader>
				<DropdownBody className='dropdown__list'>
					<ul>
						{options.map((item, index) => (
							<DropdownItem
								type='li'
								key={index}
								className={cn({
									active: item.value === option.value,
									'show-counter': showCounter,
									disabled: showCounter && item.count === 0,
								})}
								customOnClick={() => onSelect({ key: name, value: item.value })}>
								<span>{item.label}</span>
								{showCounter ? <span>({item.count || 0})</span> : null}
							</DropdownItem>
						))}
					</ul>
				</DropdownBody>
			</div>
		</BaseDropdown>
	);
}
