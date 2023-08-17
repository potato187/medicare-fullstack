import { ErrorMessage } from '@hookform/error-message';
import { useId, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import module from '../style.module.scss';
import { getFileName } from '@/admin/utilities';
import { FormattedDescription } from '@/shared/components';

export function FloatingLabelFile({ name, labelIntl }) {
	const id = useId();
	const { watch, setValue, errors, register } = useFormContext();
	const { 'form-group': formGroupCln, 'form-label': labelCln, 'form-control': inputCln } = module;

	const watchFile = watch(name, '');
	const fileName = getFileName(watchFile);

	return (
		<div className={formGroupCln}>
			<label htmlFor={id} className={inputCln}>
				<input id={id} type='file' hidden placeholder=' ' autoComplete='nope' {...register(name)} />
				<span className={labelCln}>
					<FormattedMessage id={labelIntl} />
				</span>
				<span className='d-block w-100 no-wrap-ellipsis'>
					{fileName ? fileName : <FormattedMessage id='form.choose_file_text' />}
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
