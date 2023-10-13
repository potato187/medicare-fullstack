import { useId } from 'react';
import cn from 'classnames';
import module from './style.module.scss';

export function UnFieldSwitch({ name, className, onChange = () => null, ...props }) {
	const { 'switch-input': switchCln } = module;
	const id = useId();
	return (
		<div className={cn(switchCln, className)}>
			<label htmlFor={id}>
				<input id={id} name={name} type='checkbox' onChange={onChange} {...props} />
			</label>
		</div>
	);
}
