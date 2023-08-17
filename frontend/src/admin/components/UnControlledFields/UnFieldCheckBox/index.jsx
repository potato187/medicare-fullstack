import cn from 'classnames';

export function UnFieldCheckBox({ label, className = '', ...props }) {
	return (
		<label className={cn('field-input-check', className)}>
			<input type='checkbox' {...props} />
			<span>{label}</span>
		</label>
	);
}
