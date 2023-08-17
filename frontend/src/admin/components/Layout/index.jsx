import { routesConfig } from '@/routes/routesConfig';
import { Outlet } from 'react-router-dom';
import module from './style.module.scss';
import { SidebarNavigator } from './SidebarNavigator';
import { HeaderPage } from './HeaderPage';

export function Layout() {
	const { admin: adminCln, 'admin-sidebar': sidebarCln, 'admin-main': mainCln, 'admin-wrapper': wrapperCln } = module;

	return (
		<div className={adminCln}>
			<div className={sidebarCln}>
				<SidebarNavigator routesConfig={routesConfig} />
			</div>
			<div className={mainCln}>
				<HeaderPage />
				<div className={wrapperCln}>
					<Outlet />
				</div>
			</div>
		</div>
	);
}
