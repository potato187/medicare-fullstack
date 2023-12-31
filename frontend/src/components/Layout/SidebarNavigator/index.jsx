import { PATH_IMAGES } from 'constant';
import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import module from './style.module.scss';

function NavItemGroup({
	listChildren = [],
	activePath = '',
	to = '',
	intl = '',
	Icon = () => null,
	onClick = (f) => f,
	...props
}) {
	const nodeRef = useRef(null);
	const isOpen = activePath.includes(to);

	const {
		'nav-item__group': groupCln,
		'nav-item__list': listCln,
		'item-title': titleCln,
		show: showCln,
		item: itemCln,
		icon: iconCln,
	} = module;

	const classNames = cn(groupCln, { [showCln]: isOpen });

	useEffect(() => {
		if (nodeRef.current) {
			nodeRef.current.style.setProperty('--height', `${nodeRef.current.scrollHeight}px`);
		}
	}, []);

	return (
		<div className={classNames} {...props}>
			<div aria-hidden className={titleCln} onClick={() => onClick(to)}>
				<i>
					<Icon />
				</i>
				<span>
					<FormattedMessage id={intl} />
				</span>
				<i className={iconCln}>
					<BiChevronDown />
				</i>
			</div>

			<CSSTransition in={isOpen} appear={isOpen} nodeRef={nodeRef} timeout={0} classNames='collapse'>
				<div className={listCln} ref={nodeRef}>
					{listChildren.map(({ to, intl }) => (
						<React.Fragment key={to}>
							<NavLink to={to} className={itemCln}>
								<FormattedMessage id={intl} />
							</NavLink>
						</React.Fragment>
					))}
				</div>
			</CSSTransition>
		</div>
	);
}

function NavItem({ to = '', intl = '', Icon = () => null, ...props }) {
	const { 'nav-item': navItemClass, 'item-title': titleCln } = module;
	return (
		<div className={navItemClass} {...props}>
			<NavLink to={to} className={titleCln}>
				<i>
					<Icon />
				</i>
				<span>
					<FormattedMessage id={intl} />
				</span>
			</NavLink>
		</div>
	);
}

export function SidebarNavigator({ routesConfig = [] }) {
	const { info } = useSelector((state) => state.auth);
	const location = useLocation();
	const [activePath, setActivePath] = useState(location.pathname);
	const { sidebar: sidebarCln, sidebar__header: sidebarHeaderCln, sidebar__main: sidebarMainCln } = module;

	useEffect(() => {
		setActivePath(location.pathname);
	}, [location]);

	return (
		<nav className={cn(sidebarCln, 'scrollbar')}>
			<NavLink to='/' className={sidebarHeaderCln}>
				<img src={PATH_IMAGES.LOGO} width='100' alt='' />
			</NavLink>
			<div className={sidebarMainCln}>
				{routesConfig.map(({ listChildren = [], allowedRoles = [], ...props }) =>
					allowedRoles.includes(info.role) ? (
						listChildren.length ? (
							<NavItemGroup
								key={props.intl}
								listChildren={listChildren}
								activePath={activePath}
								onClick={(path) => setActivePath(activePath === path ? '' : path)}
								{...props}
							/>
						) : (
							<NavItem key={props.intl} {...props} />
						)
					) : null,
				)}
			</div>
		</nav>
	);
}
