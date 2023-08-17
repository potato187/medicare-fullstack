import { BaseDropdown, DropdownBody, DropdownHeader } from '@/shared/components/BaseDropdown';
import cn from 'classnames';
import { useMemo } from 'react';
import { RxCaretDown } from 'react-icons/rx';
import { buildTree } from '../Tree/utilities';

const RenderTree = ({ list, onChange }) => {
	return (
		<ul>
			{list.map(({ id, name, title, isSelected, children }) => (
				<li key={id}>
					<label htmlFor={id} className='field-input-check'>
						<input
							type='radio'
							id={id}
							name={name}
							checked={isSelected}
							onChange={() => {
								onChange(id);
							}}
						/>
						<span>{title}</span>
					</label>
					{children.length ? <RenderTree list={children} onChange={onChange} /> : null}
				</li>
			))}
		</ul>
	);
};

export function DropdownTree({ nameGroup, options = [], onChange = () => {}, ...props }) {
	if (!options.length) return null;

	const option = options.filter((option) => option.isSelected)[0] || options[0];
	const memorizedTree = useMemo(() => buildTree(options), [options]);

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
					<span className='no-wrap-ellipsis'>{option.title}</span>
					<RxCaretDown size='1.5em' />
				</DropdownHeader>
				<DropdownBody className='dropdown__list tree tree--sm'>
					<RenderTree list={memorizedTree} onChange={onChange} />
				</DropdownBody>
			</div>
		</BaseDropdown>
	);
}
