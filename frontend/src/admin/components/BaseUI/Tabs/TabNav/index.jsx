import { FormattedMessage } from 'react-intl';
import cn from 'classnames';
import module from './style.module.scss';
import { useTabs } from '../TabProvider';

export function TabNav({ className = '', children }) {
	const { 'tabs-nav': tabsNavCln } = module;

	return <nav className={cn(tabsNavCln, className)}>{children}</nav>;
}

export function TabNavItem({ index, labelIntl, className = '' }) {
	const { tabIndexActive, onSelect } = useTabs();
	const { 'nav-item': navItemCln, active: activeCln } = module;
	const styles = cn(
		navItemCln,
		{
			[activeCln]: +index === tabIndexActive,
		},
		className,
	);
	const handleOnClick = () => {
		onSelect(index);
	};

	return (
		<button type='button' onClick={handleOnClick} className={styles}>
			<FormattedMessage id={labelIntl} />
		</button>
	);
}
