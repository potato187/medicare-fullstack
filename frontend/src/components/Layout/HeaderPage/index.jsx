import { LANGUAGES } from 'constant';
import { ButtonToggleSidebar } from './ButtonToggleSidbar';
import { ButtonToggleTheme } from './ButtonToggleTheme';
import { HeaderBreadcrumb } from './HeaderBreadcrumb';
import { LanguagesDropdown } from './LanguagesDropdown';
import { UserMenu } from './UserMenu';
import module from './style.module.scss';

export function HeaderPage() {
	const { header: headerCln, header__wrapper: wrapperClass } = module;

	return (
		<div className={headerCln}>
			<div className={wrapperClass}>
				<div className='d-flex justify-content-between align-items-center w-100'>
					<ButtonToggleSidebar />
					<div className='ms-auto d-flex align-items-center gap-2'>
						<LanguagesDropdown list={LANGUAGES} />
						<ButtonToggleTheme />
						<UserMenu />
					</div>
				</div>
			</div>
			<HeaderBreadcrumb />
		</div>
	);
}
