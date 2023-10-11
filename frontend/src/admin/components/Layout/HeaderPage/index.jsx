import { LANGUAGES } from 'admin/constant';
import { THEME, useTheme } from 'admin/contexts';
import { generateBreadcrumb } from 'admin/utilities';
import produce from 'immer';
import { useEffect, useState } from 'react';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import { Button } from '../../BaseUI';
import { HeaderBreadcrumb } from './HeaderBreadcrumb';
import { LanguagesDropdown } from './LanguagesDropdown';
import { UserMenu } from './UserMenu';
import module from './style.module.scss';

export function HeaderPage() {
	const location = useLocation();
	const [breadcrumb, setBreadcrumb] = useState([]);
	const { theme, setTheme } = useTheme();
	const { themeMode } = theme;
	const isDarkTheme = themeMode === THEME.DARK ? 'on' : 'off';

	const {
		header: headerCln,
		header__wrapper: wrapperClass,
		'btn-toggle': btnToggleCln,
		'btn-toggle__wrapper': btnToggleWrapperCln,
	} = module;

	const handleToggleTheme = () => {
		setTheme(
			produce((draft) => {
				draft.themeMode = draft.themeMode === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
			}),
		);
	};

	useEffect(() => {
		setBreadcrumb(generateBreadcrumb(location.pathname));
	}, [location.pathname]);

	return (
		<div className={headerCln}>
			<div className={wrapperClass}>
				<div className='d-flex justify-content-between align-items-center w-100'>
					<button type='button' className={btnToggleCln}>
						<div className={btnToggleWrapperCln}>
							<span />
							<span />
							<span />
						</div>
					</button>

					<div className='ms-auto d-flex align-items-center gap-2'>
						<LanguagesDropdown list={LANGUAGES} />
						<Button info switched square rounded fade data-switch={isDarkTheme} onClick={handleToggleTheme}>
							<MdOutlineLightMode size='1.25em' />
							<MdOutlineDarkMode size='1.25em' />
						</Button>
						<UserMenu />
					</div>
				</div>
			</div>
			{breadcrumb.length ? <HeaderBreadcrumb breadcrumb={breadcrumb} /> : null}
		</div>
	);
}
