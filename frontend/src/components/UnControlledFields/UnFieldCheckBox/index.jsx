import cn from 'classnames';

export function UnFieldCheckBox({ label, className = '', id, ...props }) {
	return (
		<label htmlFor={id} className={cn('field-checkbox', className)}>
			<input id={id} type='checkbox' {...props} />
			<span>{label}</span>
		</label>
	);
}
