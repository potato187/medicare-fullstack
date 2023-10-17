import { BaseDropdown, DropdownBody, DropdownHeader, DropdownItem } from 'components/BaseUI';
import cn from 'classnames';
import React from 'react';
import { RxCaretDown } from 'react-icons/rx';

export function PaginationSelector({
	name = '',
	className,
	perPage = 1,
	paginationNumbers = [],
	onSelect = (f) => f,
	...props
}) {
	return (
		<BaseDropdown className={className}>
			<DropdownHeader className='dropdown__header' {...props} style={{ minWidth: '60px' }}>
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
		</BaseDropdown>
	);
}
