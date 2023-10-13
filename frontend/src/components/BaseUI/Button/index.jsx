import cn from 'classnames';
import React, { forwardRef } from 'react';
import module from './style.module.scss';

function Button(
	{
		as = 'button',
		title,
		className = '',
		secondary = false,
		success = false,
		warning = false,
		danger = false,
		info = false,
		dark = false,
		fade = false,
		soft = false,
		square = false,
		full = false,
		rounded = false,
		switched = false,
		disabled = false,
		size = 'default',
		children,
		...rest
	},
	ref,
) {
	const classes = cn(
		module['button'],
		{
			[module['button-secondary']]: secondary,
			[module['button-success']]: success,
			[module['button-warning']]: warning,
			[module['button-danger']]: danger,
			[module['button-info']]: info,
			[module['button-dark']]: dark,
			[module['button-fade']]: fade,
			[module['button-soft']]: soft,
			[module['button-square']]: square,
			[module['button-rounded']]: rounded,
			[module['button-switched']]: switched,
			[module['button-full']]: full,
			[module['button-md']]: size === 'md',
			[module['button-sm']]: size === 'sm',
			[module['button-xs']]: size === 'xs',
			[module['button-square--sm']]: size === 'sm' && square,
			[module['disabled']]: disabled,
		},
		className,
	);

	const props = { ...rest, className: classes };

	return React.createElement(as, { ...props, ref }, children);
}

export default forwardRef(Button);
