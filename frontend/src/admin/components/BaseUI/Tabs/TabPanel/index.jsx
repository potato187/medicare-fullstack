import cn from 'classnames';
import module from './style.module.scss';
import { useTabs } from '../TabProvider';

export function TabPanel({ index, className = '', children }) {
	const { tabIndexActive } = useTabs();
	const { 'tab-panel': tabPanelCln, active: activeCln } = module;
	const styles = cn(tabPanelCln, { [activeCln]: +index === tabIndexActive }, className);

	return <div className={styles}>{children}</div>;
}
