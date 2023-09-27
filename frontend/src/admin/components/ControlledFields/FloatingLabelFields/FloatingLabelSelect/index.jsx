import cn from 'classnames';
import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { CSSTransition } from 'react-transition-group';
import { useClickOutside } from 'hooks';
import { useToggle } from 'admin/hooks';
import { ErrorMessage } from '@hookform/error-message';
import { FormattedDescription } from 'admin/components/BaseUI';
import module from '../style.module.scss';

export function FloatingLabelSelect({ name, labelIntl, options = [], disabled = false, className = '' }) {
	const domId = useId();
	const intl = useIntl();
	const labelText = intl.formatMessage({ id: labelIntl });
	const { control, errors, watch, setValue } = useFormContext();
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
	} = module;

	const value = watch(name);
	const currentOption = options.find((option) => option.value === value) || options[0];

	const handleOnSelect = (option) => {
		setValue(name, option.value, { shouldDirty: true, shouldTouch: true });
		toggleDropdown(false);
	};

	return (
		<div className={cn(dropdownCln, className)}>
			<div className={formGroupCln}>
				<div className={inputCln} onClick={toggleDropdown} aria-hidden>
					{currentOption?.label || ''}
				</div>
				<label htmlFor={domId} className={labelCln}>
					<FormattedMessage id={labelIntl} />
				</label>
				<Controller
					name={name}
					control={control}
					defaultValue=''
					render={({ field }) => <input hidden id={domId} type='text' {...field} />}
				/>
				<ErrorMessage
					errors={errors}
					name={name}
					render={({ message }) => (
						<div className='invalid-message'>
							<FormattedDescription id={message} values={{ label: labelText }} />
						</div>
					)}
				/>
			</div>
			{!disabled && options.length ? (
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
