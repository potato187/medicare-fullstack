import React from 'react';
import cn from 'classnames';
import module from './style.module.scss';

export function Badge({ type = 'span', children, color, ...props }) {
	const { badge } = module;
	const className = cn(badge, 'no-wrap-ellipsis');
	const style = { backgroundColor: `var(--bs-${color})` };
	return React.createElement(type, { className, style, ...props }, children);
}
