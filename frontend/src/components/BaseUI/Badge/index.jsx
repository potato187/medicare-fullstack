import React from 'react';
import cn from 'classnames';
import module from './style.module.scss';

export function Badge({ type = 'span', children, color, ...props }) {
	const colors = {
		pending: 'warning',
		confirmed: 'secondary',
		completed: 'success',
		cancelled: 'danger',
	};

	const { badge } = module;
	const className = cn(badge, 'text-nowrap');
	const style = { backgroundColor: `var(--bs-${colors[color] || 'primary'})` };
	return React.createElement(type, { className, style, ...props }, children);
}
