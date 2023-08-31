import cn from 'classnames';
import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { CSSTransition } from 'react-transition-group';
import { useClickOutside } from 'hooks';
import { useToggle } from 'admin/hooks';
import module from '../style.module.scss';

export function FloatingLabelSelect({ name, labelIntl, options = [], disabled = false, className = '' }) {
	const domId = useId();
	const methods = useFormContext();
	const [isOpen, toggleDropdown] = useToggle();
	const nodeRef = useClickOutside(() => {
		toggleDropdown(false);
	});

	if (!options.length) return null;

	const {
		'form-group': formGroupCln,
		'form-label': labelCln,
		'form-control': inputCln,
		'select-dropdown': dropdownCln,
		'select-dropdown__list': dropdownListCln,
		'item-active': activeCln,
	} = module;

	const value = methods.getValues(name);
	const currentOption = options.find((option) => option.value === value) || options[0];

	const handleOnSelect = (option) => {
		methods.setValue(name, option.value, { shouldDirty: true, shouldTouch: true });
		toggleDropdown(false);
	};

	return (
		<div className={cn(dropdownCln, className)}>
			<div className={formGroupCln}>
				<div className={inputCln} onClick={toggleDropdown} aria-hidden>
					{currentOption.label}
				</div>
				<label htmlFor={domId} className={labelCln}>
					<FormattedMessage id={labelIntl} />
				</label>
				<Controller
					name={name}
					control={methods.control}
					defaultValue=''
					render={({ field }) => <input hidden id={domId} type='text' {...field} />}
				/>
			</div>
			{!disabled ? (
				<CSSTransition in={isOpen} timeout={300} classNames='dropdown-menu' unmountOnExit nodeRef={nodeRef}>
					<div className={cn(dropdownListCln, 'scrollbar scrollbar--sm')} ref={nodeRef}>
						{options.map((option) => (
							<div
								aria-hidden
								key={option.value}
								className={cn({
									[activeCln]: option.value === currentOption.value,
								})}
								onClick={() => handleOnSelect(option)}
							>
								{option.label}
							</div>
						))}
					</div>
				</CSSTransition>
			) : null}
		</div>
	);
}
