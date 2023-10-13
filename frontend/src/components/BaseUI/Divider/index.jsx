import React from 'react';
import cn from 'classnames';
import module from './style.module.scss';

export function Divider({ type = 'div', children, ...props }) {
	const className = cn(module.divider, props.className);
	return React.createElement(type, { ...props, className }, children);
}
