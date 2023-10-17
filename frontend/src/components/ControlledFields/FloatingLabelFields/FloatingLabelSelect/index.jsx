import { ErrorMessage } from '@hookform/error-message';
import { FormattedDescription } from 'components/BaseUI';
import { useClickOutside, useToggle } from 'hooks';
import cn from 'classnames';
import { useId, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { CSSTransition } from 'react-transition-group';
import module from '../style.module.scss';

export function FloatingLabelSelect({ name, labelIntl, options = [], disabled = false, className = '' }) {
	const domId = useId();
	const intl = useIntl();
	const nodeRef = useRef(null);
	const [isOpen, toggle] = useToggle();
	const { control, errors, watch, setValue } = useFormContext();
	const labelText = intl.formatMessage({ id: labelIntl });

	const {
		'form-group': formGroupCln,
		'form-label': formLabelCln,
		'form-control': formControlCln,
		dropdown: dropdownCln,
		dropdown__list: dropdownListCln,
		'item-active': itemActiveCln,
	} = module;

	const value = watch(name);
	const currentOption = options.find((option) => option.value === value) || options[0];

	const handleSelect = (option) => {
		setValue(name, option.value, { shouldDirty: true, shouldTouch: true });
		toggle(false);
	};

	const handleClickOutside = () => {
		toggle(false);
	};

	useClickOutside(nodeRef, handleClickOutside);

	return (
		<div className={cn(dropdownCln, className)}>
			<div className={formGroupCln}>
				<div className={formControlCln} onClick={toggle} aria-hidden>
					{currentOption?.label || ''}
				</div>
				<label htmlFor={domId} className={formLabelCln}>
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
									'text-nowrap': true,
									[itemActiveCln]: option.value === currentOption.value,
								})}
								onClick={() => handleSelect(option)}
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
