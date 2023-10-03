import { ErrorMessage } from '@hookform/error-message';
import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { getFileName } from 'admin/utilities';
import { FormattedDescription } from 'admin/components/BaseUI';
import module from '../style.module.scss';

export function FloatingLabelFile({ name, labelIntl }) {
	const domId = useId();
	const { watch, errors, register } = useFormContext();
	const { 'form-group': formGroupCln, 'form-label': labelCln, 'form-control': inputCln } = module;

	const watchFile = watch(name, '');
	const fileName = getFileName(watchFile);

	return (
		<div className={formGroupCln}>
			<label htmlFor={domId} className={inputCln}>
				<input id={domId} type='file' hidden placeholder=' ' autoComplete='nope' {...register(name)} />
				<span className={labelCln}>
					<FormattedMessage defaultMessage={labelIntl} id={labelIntl} />
				</span>
				<span className='d-block w-100 no-wrap-ellipsis'>
					{fileName || <FormattedMessage id='form.choose_file_text' />}
				</span>
			</label>
			<ErrorMessage
				errors={errors}
				name={name}
				render={({ message }) => (
					<div className='invalid-message'>
						<FormattedDescription id={message} values={{ label: labelIntl }} />
					</div>
				)}
			/>
		</div>
	);
}
