import { NavLink } from 'react-router-dom';
import { PATH_IMAGES } from '@/admin/constant';
import { ROOT_PATH } from '@/routes';
import module from './style.module.scss';

export function Layout({ children }) {
	const {
		'page-login': loginCln,
		'page-login__layout': layoutCln,
		'page-login__main': mainCln,
		background: backgroundCln,
		shape: shapeCln,
	} = module;

	return (
		<div className={loginCln}>
			<div className={layoutCln} style={{ background: `url(${PATH_IMAGES.AUTH_BANNER}) center / cover no-repeat` }}>
				<div className={backgroundCln} />
				<div className={shapeCln}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						version='1.1'
						xmlnsXlink='http://www.w3.org/1999/xlink'
						viewBox='0 0 1440 120'
					>
						<path d='M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z' />
					</svg>
				</div>
			</div>
			<div className={mainCln}>
				<div className='container'>
					<div className='text-center'>
						<NavLink to={ROOT_PATH} className='d-block mb-3'>
							<img height='20' width='20' src={PATH_IMAGES.LOGO_SM} alt='' />
						</NavLink>
						<p className='fw-700 text-white-50 mb-3'>Premium Admin & Dashboard Template</p>
					</div>
					<div className='row'>
						<div className='col-4 offset-4'>{children}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
