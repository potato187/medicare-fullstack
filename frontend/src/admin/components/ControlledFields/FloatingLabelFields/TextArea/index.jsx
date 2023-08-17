import cn from 'classnames';
import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import module from '../style.module.scss';

export function TextArea({ name, labelIntl, className = '', ...props }) {
	const { control } = useFormContext();
	const id = useId();
	const {
		'form-group': formGroupCln,
		'form-label': labelCln,
		'form-control': inputCln,
		textarea: textareaCln,
	} = module;

	const classNames = cn(inputCln, textareaCln);

	return (
		<div className={formGroupCln}>
			<Controller
				control={control}
				name={name}
				defaultValue=''
				render={({ field }) => (
					<textarea autoComplete='off' id={id} className={classNames} {...field} {...props}></textarea>
				)}
			/>
			<label htmlFor={id} className={labelCln}>
				<FormattedMessage id={labelIntl} />
			</label>
		</div>
	);
}
