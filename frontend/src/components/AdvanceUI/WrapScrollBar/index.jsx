import React from 'react';
import cn from 'classnames';

export function WrapScrollBar({ as = 'div', className = '', children, size = '', ...props }) {
	const style = cn(
		'scrollbar',
		{
			'scrollbar--sm': size === 'sm',
		},
		className,
	);
	return React.createElement(as, { className: style, ...props }, children);
}
