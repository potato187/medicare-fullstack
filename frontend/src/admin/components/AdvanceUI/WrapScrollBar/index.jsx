import React from 'react';
import cn from 'classnames';
import module from './style.module.scss';

export function WrapScrollBar({ as = 'div', className = '', children, size = '', ...props }) {
	const { scrollbar: scrollbarCln, 'scrollbar--sm': smCln } = module;
	const style = cn(
		scrollbarCln,
		{
			[smCln]: size === 'sm',
		},
		className,
	);
	return React.createElement(as, { className: style, ...props }, children);
}
