import React from 'react';
import cn from 'classnames';
import module from './style.module.scss';

export function TextShadow({ type = 'h1', children, ...props }) {
	const className = cn(props.className, module.textShadow);

	return React.createElement(type, { ...props, className }, children);
}
