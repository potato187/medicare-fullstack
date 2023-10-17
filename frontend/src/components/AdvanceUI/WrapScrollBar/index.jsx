import React from 'react';
import cn from 'classnames';

export function WrapScrollBar({ as = 'div', className = '', children, size = '', ...props }) {
	const classNames = cn(
		'scrollbar',
		{
			'scrollbar--sm': size === 'sm',
		},
		className,
	);
	return React.createElement(as, { className: classNames, ...props }, children);
}
