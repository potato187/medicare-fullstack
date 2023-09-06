import { BaseDropdown, DropdownBody, DropdownHeader, DropdownItem } from 'admin/components/BaseUI';
import cn from 'classnames';
import React from 'react';
import { RxCaretDown } from 'react-icons/rx';

export function Dropdown({ name = '', options = [], value = '', className = '', size = '', onSelect = () => {} }) {
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
						{options.map((item) => (
							<React.Fragment key={item.value}>
								<DropdownItem
									type='li'
									className={cn({
										active: item.value === option.value,
									})}
									customOnClick={() => onSelect({ key: name, value: item.value })}
								>
									<span>{item.label}</span>
								</DropdownItem>
							</React.Fragment>
						))}
					</ul>
				</DropdownBody>
			</div>
		</BaseDropdown>
	);
}
