import { useTabs } from '../TabProvider';
import module from './style.module.scss';
import cn from 'classnames';
export function TabPanel({ tabIndex, className = '', children }) {
	const { tabIndexActive } = useTabs();
	const { 'tab-panel': tabPanelCln, active: activeCln } = module;
	const styles = cn(tabPanelCln, { [activeCln]: tabIndex === tabIndexActive }, className);

	return <div className={styles}>{children}</div>;
}
