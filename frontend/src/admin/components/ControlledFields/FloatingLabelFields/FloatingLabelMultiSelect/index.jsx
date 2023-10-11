import { ErrorMessage } from '@hookform/error-message';
import { useClickOutside, useToggle } from 'admin/hooks';
import cn from 'classnames';
import { useId, useMemo, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { CSSTransition } from 'react-transition-group';
import { FormattedDescription } from 'admin/components/BaseUI';
import module from '../style.module.scss';

function Tag({ value, label, onClick }) {
	const { 'choices-item': itemCln } = module;

	const handleOnClick = () => {
		onClick(value);
	};

	return (
		<div className={itemCln}>
			<span>{label}</span>
			<button type='button' onClick={handleOnClick}>
				remove item
			</button>
		</div>
	);
}

export function FloatingLabelMultiSelect({ name, options, labelIntl }) {
	const domId = useId();
	const intl = useIntl();
	const nodeRef = useRef(null);

	const labelText = intl.formatMessage({ id: labelIntl });
	const { control, errors, watch, setValue } = useFormContext();
	const [isOpen, toggleDropdown] = useToggle();

	const handleClickOutside = () => {
		toggleDropdown(false);
	};

	useClickOutside(nodeRef, handleClickOutside);

	const {
		dropdown: dropdownCln,
		dropdown__list: dropdownListCln,
		'dropdown-multi': dropdownMultiCln,
		'form-group': formGroupCln,
		'multi-select': multiSelectCln,
		'form-label': labelCln,
		'form-control': inputCln,
	} = module;

	const watchValue = watch(name, []);

	const listOption = useMemo(() => {
		return options.map(({ ...props }) => {
			return { ...props, isSelected: watchValue.includes(props.value) };
		});
	}, [watchValue, options]);

	const allOptionsSelected = listOption.every((option) => option.isSelected);

	const handleTagRemoval = (valueToRemove) => {
		const updatedList = watchValue.filter((value) => value !== valueToRemove);
		setValue(name, updatedList, { shouldDirty: true, shouldTouch: true });
	};

	const handleAddOption = (valueToAdd) => {
		setValue(name, watchValue.concat(valueToAdd), { shouldDirty: true, shouldTouch: true });
	};

	return (
		<div className={cn(dropdownCln, dropdownMultiCln)}>
			<div className={cn(formGroupCln, multiSelectCln)}>
				<div className={inputCln} onClick={toggleDropdown} aria-hidden>
					{listOption.map(({ isSelected, label, value }) =>
						isSelected ? <Tag key={value} value={value} label={label} onClick={handleTagRemoval} /> : null,
					)}
				</div>
				<label htmlFor={domId} className={labelCln}>
					<FormattedMessage id={labelIntl} />
				</label>
				<Controller
					name={name}
					control={control}
					defaultValue=''
					render={({ field }) => <input hidden id={domId} {...field} />}
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
			{listOption.length ? (
				<CSSTransition in={isOpen} timeout={300} classNames='dropdown-menu' unmountOnExit nodeRef={nodeRef}>
					<div className={cn(dropdownListCln, 'scrollbar scrollbar--sm')} ref={nodeRef}>
						{listOption.map((option) =>
							!option.isSelected ? (
								<div aria-hidden key={option.value} onClick={() => handleAddOption(option.value)}>
									{option.label}
								</div>
							) : null,
						)}
						{allOptionsSelected ? (
							<div key='option-empty' disabled>
								<FormattedMessage id='form.multi_select.empty_options' />
							</div>
						) : null}
					</div>
				</CSSTransition>
			) : null}
		</div>
	);
}
