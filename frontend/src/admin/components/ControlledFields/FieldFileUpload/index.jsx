import { ErrorMessage } from '@hookform/error-message';
import { PATH_IMAGES } from 'admin/constant';
import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import module from './style.module.scss';
import { FiledUploadMedia } from './FiledUploadMedia';

export function FieldFileUpload({ name, intlLabel }) {
	const domId = useId();

	const { register, errors } = useFormContext();
	const {
		'file-upload': fileUploadCln,
		'file-upload__wrapper': wrapperCln,
		'file-upload__inner': innerCln,
		'message-invalid': messageCln,
	} = module;

	return (
		<div className={fileUploadCln} style={{ '--URL': `url(${PATH_IMAGES.BANNER_PLACEHOLDER})` }}>
			<div className={wrapperCln}>
				<div className={innerCln}>
					<input id={domId} type='file' {...register(name)} />
					<FiledUploadMedia name={name} id={domId} intlLabel={intlLabel} />
					<ErrorMessage
						name={name}
						errors={errors}
						render={({ message }) => (
							<div className={messageCln}>
								<FormattedMessage id={message} />
							</div>
						)}
					/>
				</div>
			</div>
		</div>
	);
}
