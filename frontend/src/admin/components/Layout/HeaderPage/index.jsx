import { LANGUAGES } from 'admin/constant';
import { generateBreadcrumb } from 'admin/utilities';
import { useAuth } from 'hooks';
import { useEffect, useState } from 'react';
import { BiExitFullscreen, BiFullscreen } from 'react-icons/bi';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import { Button } from '../../BaseUI';
import { HeaderBreadcrumb } from './HeaderBreadcrumb';
import { LanguagesDropdown } from './LanguagesDropdown';
import { UserMenu } from './UserMenu';
import module from './style.module.scss';

export function HeaderPage() {
	const location = useLocation();
	const { info } = useAuth();
	const [breadcrumb, setBreadcrumb] = useState([]);

	useEffect(() => {
		setBreadcrumb(generateBreadcrumb(location.pathname));
	}, [location.pathname]);

	const {
		header: headerCln,
		header__wrapper: wrapperClass,
		toggle_sidebar: toggleCln,
		toggle_sidebar__wrapper: toggleWrapperCln,
	} = module;

	return (
		<div className={headerCln}>
			<div className={wrapperClass}>
				<div className='d-flex justify-content-between align-items-center w-100'>
					<button type='button' className={toggleCln}>
						<div className={toggleWrapperCln}>
							<span />
							<span />
							<span />
						</div>
					</button>

					<div className='ms-auto d-flex align-items-center gap-2'>
						<LanguagesDropdown list={LANGUAGES} />
						<Button info switched square rounded fade>
							<BiFullscreen size='1.25em' />
							<BiExitFullscreen size='1.25em' />
						</Button>
						<Button info switched square rounded fade>
							<MdOutlineLightMode size='1.25em' />
							<MdOutlineDarkMode size='1.25em' />
						</Button>
						<UserMenu {...info} />
					</div>
				</div>
			</div>
			{!!breadcrumb.length && <HeaderBreadcrumb breadcrumb={breadcrumb} />}
		</div>
	);
}
