import { useId } from 'react';
import module from './style.module.scss';
import cn from 'classnames';

export function UnFieldSwitch({ name, className, onChange = () => null, ...props }) {
	const { 'switch-input': switchCln } = module;
	const id = useId();
	return (
		<div className={cn(switchCln, className)}>
			<input id={id} name={name} type='checkbox' onChange={onChange} {...props} />
			<label htmlFor={id} />
		</div>
	);
}
