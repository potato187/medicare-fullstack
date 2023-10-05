import cn from 'classnames';
import { FormattedMessage } from 'react-intl';
import { useTabs } from '../TabProvider';
import module from './style.module.scss';

export function TabNav({ children, variant = 'default' }) {
	const { 'tabs-nav': tabsNavCln, 'tabs-nav__bordered': tabsNavBorderedCln } = module;

	const classNames = cn(tabsNavCln, {
		[tabsNavBorderedCln]: variant === 'bordered',
	});

	return <nav className={classNames}>{children}</nav>;
}

export function TabNavItem({ index, labelIntl }) {
	const { tabIndexActive, onSelect } = useTabs();
	const { 'nav-item': navItemCln, active: activeCln } = module;
	const classNames = cn(navItemCln, {
		[activeCln]: +index === tabIndexActive,
	});
	const handleOnClick = () => {
		onSelect(index);
	};

	return (
		<button type='button' onClick={handleOnClick} className={classNames}>
			<FormattedMessage id={labelIntl} />
		</button>
	);
}
