import { PATH_IMAGES } from '@/admin/constant';
import React, { useEffect, useId, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MdOutlinePermMedia } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import module from './style.module.scss';
import { ErrorMessage } from '@hookform/error-message';
import { generateUrl, typeOf } from '@/utils';

const FiledUploadMedia = ({ name, intlLabel, id, type }) => {
	const { watch, formState } = useFormContext();
	const watchFile = watch(name, '');
	const [progress, setProgress] = useState(0);
	const blobUrl = useRef('');

	const {
		'file-upload__container': containerCln,
		'file-upload__label': labelCln,
		'progress-bar': progressBarCln,
		'progress-bar__icon': progressBarIconCln,
		'progress-bar__ring': progressBarRingCln,
	} = module;

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prevState) => {
				if (prevState >= 100) {
					clearInterval(timer);
					if (!formState.errors[name] && watchFile) {
						blobUrl.current =
							typeOf(watchFile) === 'string' ? generateUrl(watchFile, type) : URL.createObjectURL(watchFile[0]);
					} else {
						blobUrl.current = '';
					}
					return 0;
				}

				return prevState + Math.ceil(Math.random() * 10);
			});
		}, 100);

		return () => {
			clearInterval(timer);
		};
	}, [watchFile]);

	return (
		<React.Fragment>
			<label className={containerCln} htmlFor={id}>
				{!progress ? (
					<React.Fragment>
						{!blobUrl.current ? (
							<React.Fragment>
								<MdOutlinePermMedia size='2em' />
								<span className={labelCln}>
									<FormattedMessage id={intlLabel} />
								</span>
							</React.Fragment>
						) : (
							<div className='ratio ratio-16x9'>
								{!progress && !formState.errors[name] ? <img src={blobUrl.current} alt='' /> : null}
							</div>
						)}
					</React.Fragment>
				) : (
					<div className={progressBarCln} style={{ '--progress': `${progress}` }}>
						<div className={progressBarIconCln}>
							<svg className={progressBarRingCln} viewBox='0 0 44 44'>
								<circle cx='22' cy='22' r='20.2' />
							</svg>
						</div>
					</div>
				)}
			</label>
		</React.Fragment>
	);
};

export function FieldFileUpload({ name, intlLabel, ...props }) {
	const id = useId();

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
					<input id={id} type='file' {...register(name)} />
					<FiledUploadMedia name={name} id={id} intlLabel={intlLabel} {...props} />
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
