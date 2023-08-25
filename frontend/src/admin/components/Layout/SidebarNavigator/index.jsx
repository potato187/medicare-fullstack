import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { PATH_IMAGES } from 'admin/constant';
import module from './style.module.scss';

function NavItemGroup({
	listChildren = [],
	activePath = '',
	to = '',
	intl = '',
	Icon = () => null,
	onClick = () => null,
	...props
}) {
	const nodeRef = useRef(null);
	const isOpen = activePath.includes(to);

	const {
		'nav-item__group': groupCln,
		show: showCln,
		'nav-item__list': listCln,
		item: itemCln,
		'item-title': titleCln,
		icon: iconCln,
	} = module;

	const handleOnclick = () => {
		onClick(to);
	};

	useEffect(() => {
		if (nodeRef.current) {
			nodeRef.current.style.setProperty('--height', `${nodeRef.current.scrollHeight}px`);
		}
	}, []);

	return (
		<div className={cn(groupCln, { [showCln]: isOpen })} {...props}>
			<div aria-hidden className={titleCln} onClick={handleOnclick}>
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
	const { payload } = useSelector((state) => state.auth);

	const location = useLocation();
	const [activePath, setActivePath] = useState(location.pathname);

	const onClick = (path) => {
		setActivePath(activePath === path ? '' : path);
	};

	const {
		'sidebar-navigator': navigatorClass,
		'sidebar-navigator__header': headerClass,
		'sidebar-navigator__main': mainClass,
	} = module;

	return (
		<nav className={navigatorClass}>
			<NavLink to='/' className={headerClass}>
				<img src={PATH_IMAGES.LOGO} width='100' alt='' />
			</NavLink>
			<div className={mainClass}>
				{routesConfig.map(({ listChildren = [], allowedRoles = [], ...props }) =>
					allowedRoles.includes(payload.role) ? (
						listChildren.length ? (
							<NavItemGroup
								key={props.intl}
								listChildren={listChildren}
								activePath={activePath}
								onClick={onClick}
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
