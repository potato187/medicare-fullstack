import module from './style.module.scss';

export function Preloader() {
	const { preloader } = module;

	return (
		<div className={preloader}>
			<div>
				<span className='visually-hidden'>Loading...</span>
			</div>
		</div>
	);
}
