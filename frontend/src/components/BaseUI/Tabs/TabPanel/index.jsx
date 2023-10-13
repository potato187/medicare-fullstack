import cn from 'classnames';
import module from './style.module.scss';
import { useTabs } from '../TabProvider';

export function TabPanel({ tabPanelIndex, className = '', children }) {
	const { tabIndexActive } = useTabs();
	const { 'tab-panel': tabPanelCln, active: activeCln } = module;
	const styles = cn(tabPanelCln, { [activeCln]: +tabPanelIndex === tabIndexActive }, className);

	return <div className={styles}>{children}</div>;
}
