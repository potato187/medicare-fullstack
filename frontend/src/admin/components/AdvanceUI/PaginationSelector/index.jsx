import { BaseDropdown, DropdownBody, DropdownHeader, DropdownItem } from 'admin/components/BaseUI';
import cn from 'classnames';
import React from 'react';
import { RxCaretDown } from 'react-icons/rx';

export function PaginationSelector({
	name = '',
	className = '',
	size = '',
	paginationNumbers = [],
	perPage = 1,
	onSelect = (f) => f,
	...props
}) {
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
				<DropdownHeader className='dropdown__header' {...props}>
					<span>{perPage}</span>
					<RxCaretDown size='1.5em' />
				</DropdownHeader>
				<DropdownBody className='dropdown__list'>
					<ul>
						{paginationNumbers.map((item) => (
							<React.Fragment key={item}>
								<DropdownItem
									type='li'
									className={cn({ active: item === +perPage })}
									customOnClick={() => onSelect({ key: name, value: item })}
								>
									{item}
								</DropdownItem>
							</React.Fragment>
						))}
					</ul>
				</DropdownBody>
			</div>
		</BaseDropdown>
	);
}
