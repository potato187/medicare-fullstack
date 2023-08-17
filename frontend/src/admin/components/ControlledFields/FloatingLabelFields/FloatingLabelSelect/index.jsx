import { useToggle } from '@/admin/hooks';
import { useClickOutside } from '@/hooks';
import cn from 'classnames';
import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { CSSTransition } from 'react-transition-group';
import module from '../style.module.scss';

export function FloatingLabelSelect({
	showCounter = false,
	name,
	labelIntl,
	options = [],
	disabled = false,
	isNotDisabled = false,
	className = '',
}) {
	if (!options.length) return null;

	const id = useId();
	const { control, setValue, getValues } = useFormContext();
	const [isOpen, toggleDropdown] = useToggle();
	const nodeRef = useClickOutside(() => {
		toggleDropdown(false);
	});

	const {
		'form-group': formGroupCln,
		'form-label': labelCln,
		'form-control': inputCln,
		'select-dropdown': dropdownCln,
		'select-dropdown__list': dropdownListCln,
		'item-active': activeCln,
		'item-disabled': disabledCln,
	} = module;

	const value = getValues(name);
	const option = options.find((option) => option.value === value) || options[0];

	const handleOnSelect = (option) => {
		setValue(name, option.value);
		toggleDropdown(false);
	};

	return (
		<div className={cn(dropdownCln, className)}>
			<div className={formGroupCln}>
				<div className={inputCln} onClick={toggleDropdown}>
					{option.label}
				</div>
				<label htmlFor={id} className={labelCln}>
					<FormattedMessage id={labelIntl} />
				</label>
				<Controller
					name={name}
					control={control}
					render={({ field }) => <input id={id} type='text' hidden {...field} />}
				/>
			</div>
			{!disabled ? (
				<CSSTransition in={isOpen} timeout={300} classNames='dropdown-menu' unmountOnExit nodeRef={nodeRef}>
					<div className={cn(dropdownListCln, 'scrollbar scrollbar--sm')} ref={nodeRef}>
						{options.map((item, index) => (
							<div
								key={index}
								className={cn({
									[activeCln]: item.value === option.value,
									[disabledCln]: item.disabled && isNotDisabled,
									[disabledCln]: showCounter && item.count === 0,
								})}
								onClick={() => handleOnSelect(item)}>
								{`${item.label} ${item.count ? `(${item.count})` : ''}`}
							</div>
						))}
					</div>
				</CSSTransition>
			) : null}
		</div>
	);
}
