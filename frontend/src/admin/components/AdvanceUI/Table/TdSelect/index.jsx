import cn from 'classnames';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { RxCaretDown } from 'react-icons/rx';
import { CSSTransition } from 'react-transition-group';
import { useClickOutside, useSwitchState } from 'hooks';
import module from './style.module.scss';

export function TdSelect({ name, options = [], ...props }) {
	const [position, setPosition] = useState({
		top: '100%',
		left: 0,
		right: 0,
		zIndex: 10,
	});
	const { control, getValues, setValue } = useFormContext();
	const id = useId();
	const { isOpen, turnOn: openSelect, turnOff: closeSelect } = useSwitchState();
	const tdRef = useRef(null);
	const nodeRef = useClickOutside(() => {
		closeSelect();
	});

	const {
		'td-select': tdSelectCln,
		'td-select__header': selectHeaderCln,
		'td-select__list': listCln,
		focus: focusCln,
	} = module;
	const value = getValues(name);
	const option = options.find((option) => option.value === value) ?? options[0];
	const style = cn(tdSelectCln, {
		[focusCln]: isOpen,
	});

	const handleSelectOption = (value) => {
		setValue(name, value);
		closeSelect();
	};

	useEffect(() => {
		if (option.value !== value) {
			setValue(name, option.value);
		}
	}, [name, option.value, setValue, value]);

	useLayoutEffect(() => {
		if (nodeRef.current && tdRef.current) {
			const idTable = tdRef.current.dataset.parent;
			const table = document.getElementById(idTable).getBoundingClientRect();
			const td = tdRef.current.getBoundingClientRect();
			const tdHeight = td.height;
			const dropdownList = nodeRef.current.getBoundingClientRect();
			const dropdownHeight = dropdownList.height;

			const spaceAbove = dropdownList.top - tdHeight - table.top;
			const spaceBelow = table.bottom - dropdownList.bottom;

			if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight + tdHeight + 4) {
				setPosition((prevState) => ({
					...prevState,
					top: `-${dropdownHeight}px`,
					marginTop: '-4px',
				}));
			}
		}
	}, [isOpen, nodeRef]);

	return (
		<td ref={tdRef} {...props}>
			<div className={style}>
				<div aria-hidden className={selectHeaderCln} onClick={openSelect}>
					<span className='text-capitalize'>{option.label}</span>
					<Controller
						id={id}
						name={name}
						control={control}
						render={({ field }) => <input type='hidden' {...field} />}
					/>
					<RxCaretDown size='1.5em' />
				</div>
				<CSSTransition in={isOpen} timeout={300} classNames='dropdown-menu' unmountOnExit nodeRef={nodeRef}>
					<div className={cn('select-list', listCln)} style={{ ...position }} ref={nodeRef}>
						<ul className='scrollbar scrollbar--sm'>
							{options.map(({ value, label }) => (
								<li
									aria-hidden
									type='li'
									key={value}
									className={cn('text-capitalize', { active: value === option.value })}
									onClick={() => handleSelectOption(value)}
								>
									{label}
								</li>
							))}
						</ul>
					</div>
				</CSSTransition>
			</div>
		</td>
	);
}
