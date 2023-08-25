import { ErrorMessage } from '@hookform/error-message';
import cn from 'classnames';
import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSwitchState } from 'hooks';
import { FormattedDescription } from 'admin/components/BaseUI';
import module from '../style.module.scss';

export function FloatingLabelPassword({ name, labelIntl, ...props }) {
	const id = useId();
	const intl = useIntl();
	const labelText = intl.formatMessage({ id: labelIntl });
	const { isOpen, toggle } = useSwitchState(false);
	const { control, errors } = useFormContext();
	const type = isOpen ? 'text' : 'password';

	const {
		'form-group': formGroupCln,
		'form-password': passwordCln,
		'form-label': labelCln,
		'form-control': inputCln,
	} = module;

	return (
		<div className={cn(formGroupCln, passwordCln)}>
			<Controller
				control={control}
				name={name}
				defaultValue=''
				render={({ field }) => (
					<input type={type} id={id} className={inputCln} {...field} {...props} placeholder=' ' autoComplete='nope' />
				)}
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
			<label htmlFor={id} className={labelCln}>
				<FormattedMessage id={labelIntl} />
			</label>
			<button type='button' onClick={toggle}>
				{isOpen ? <VscEye size='1.25em' /> : <VscEyeClosed size='1.25em' />}
			</button>
		</div>
	);
}
