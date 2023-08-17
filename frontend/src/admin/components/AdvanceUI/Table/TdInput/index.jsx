import { Controller, useFormContext, useFormState } from 'react-hook-form';
import module from './style.module.scss';
import cn from 'classnames';
import { useId } from 'react';

export function TdInput({ name, className }) {
	const { control, formState } = useFormContext();
	const id = useId();
	const { 'td-input': tdCln, invalid: invalidCln } = module;
	const keys = name.split('.');
	const style = cn({
		[invalidCln]: !!formState.errors?.[keys[0]]?.[keys[1]]?.[keys[2]],
	});

	return (
		<td className={cn(tdCln, className)}>
			<Controller
				name={name}
				control={control}
				defaultValue=''
				render={({ field }) => <input className={style} id={id} {...field} />}
			/>
		</td>
	);
}
