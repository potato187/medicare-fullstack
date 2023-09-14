import cn from 'classnames';
import { useMemo } from 'react';
import { RxCaretDown } from 'react-icons/rx';
import { BaseDropdown, DropdownBody, DropdownHeader } from 'admin/components/BaseUI';
import { buildTree } from '../Tree/utilities';

function RenderTree({ languageId, currentValue, options, onChange }) {
	const list = useMemo(() => buildTree(options), [options]);

	return (
		<ul>
			{list.map(({ value, name, label }) => (
				<li key={value}>
					<label htmlFor={value} className='field-input-check'>
						<input
							type='radio'
							id={value}
							name={name}
							checked={currentValue === value}
							onChange={() => {
								onChange(value);
							}}
						/>
						<span>{label?.[languageId] || ''}</span>
					</label>
				</li>
			))}
		</ul>
	);
}

export function DropdownTree({
	languageId = 'en',
	nameGroup,
	value = 'all',
	options = [],
	onChange = () => {},
	...props
}) {
	const option = options.filter((option) => option.value === value)[0];
	console.log(options);

	const styles = cn(
		'dropdown',
		{
			'dropdown--sm': props.size === 'sm',
			'dropdown--md': props.size === 'md',
		},
		props.className,
	);

	return (
		<BaseDropdown>
			<div className={styles}>
				<DropdownHeader className='dropdown__header'>
					<span className='no-wrap-ellipsis'>{option?.label?.[languageId] || ''}</span>
					<RxCaretDown size='1.5em' />
				</DropdownHeader>
				{options.length > 0 && (
					<DropdownBody className='dropdown__list tree tree--sm'>
						<RenderTree currentValue={value} languageId={languageId} options={options} onChange={onChange} />
					</DropdownBody>
				)}
			</div>
		</BaseDropdown>
	);
}
