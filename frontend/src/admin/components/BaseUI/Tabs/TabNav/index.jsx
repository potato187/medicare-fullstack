import module from './style.module.scss';
import cn from 'classnames';
import { useTabs } from '../TabProvider';
import { FormattedMessage } from 'react-intl';

export function TabNav({ className = '', children }) {
	const { 'tabs-nav': tabsNavCln } = module;

	return (
		<nav className={cn(tabsNavCln, className)} role='tablist'>
			{children}
		</nav>
	);
}

export function TabNavItem({ tabIndex, labelIntl, className = '' }) {
	const { tabIndexActive, onSelect } = useTabs();
	const { 'nav-item': navItemCln, active: activeCln } = module;
	const styles = cn(
		navItemCln,
		{
			[activeCln]: tabIndex === tabIndexActive,
		},
		className,
	);
	const handleOnClick = () => {
		onSelect(tabIndex);
	};

	return (
		<button type='button' onClick={handleOnClick} className={styles}>
			<FormattedMessage id={labelIntl} />
		</button>
	);
}
