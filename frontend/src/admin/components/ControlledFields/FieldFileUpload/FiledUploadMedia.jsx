import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MdOutlinePermMedia } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { generateUrl, typeOf } from 'utils';
import module from './style.module.scss';

function Container({ progress = 0, url = '', intlLabel, error = null }) {
	const {
		'file-upload__label': labelCln,
		'progress-bar': progressBarCln,
		'progress-bar__icon': progressBarIconCln,
		'progress-bar__ring': progressBarRingCln,
	} = module;

	if (!progress && !url) {
		return (
			<>
				<MdOutlinePermMedia size='2em' />
				<span className={labelCln}>
					<FormattedMessage id={intlLabel} />
				</span>
			</>
		);
	}

	if (!progress && url) {
		return <div className='ratio ratio-16x9'>{url && !error ? <img src={url} alt='' /> : null}</div>;
	}

	return (
		<div className={progressBarCln} style={{ '--progress': `${progress}` }}>
			<div className={progressBarIconCln}>
				<svg className={progressBarRingCln} viewBox='0 0 44 44'>
					<circle cx='22' cy='22' r='20.2' />
				</svg>
			</div>
		</div>
	);
}

export function FiledUploadMedia({ name, intlLabel, id, type = 'thumbnail' }) {
	const { watch, formState } = useFormContext();
	const watchFile = watch(name, '');
	const [progress, setProgress] = useState(0);
	const blobUrl = useRef('');

	const { 'file-upload__container': containerCln } = module;

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prevState) => {
				if (prevState >= 100) {
					clearInterval(timer);
					blobUrl.current =
						!formState.errors[name] && watchFile
							? typeOf(watchFile) === 'string'
								? generateUrl(watchFile, type)
								: watchFile[0]
								? URL.createObjectURL(watchFile[0])
								: ''
							: '';
					return 0;
				}

				return prevState + Math.ceil(Math.random() * 10);
			});
		}, 100);

		return () => {
			clearInterval(timer);
		};
	}, [watchFile, formState.errors, name, type]);

	return (
		<label htmlFor={id} className={containerCln}>
			<input hidden disabled readOnly />
			<Container progress={progress} url={blobUrl.current} intlLabel={intlLabel} error={formState?.errors?.[name]} />
		</label>
	);
}
