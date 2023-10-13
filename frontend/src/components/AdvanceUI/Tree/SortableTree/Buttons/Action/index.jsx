import classNames from 'classnames';
import React from 'react';
import styles from './style.module.scss';

export const Action = React.forwardRef(({ active, className, cursor, style, ...props }, ref) => {
	return (
		<button
			type='button'
			ref={ref}
			{...props}
			className={classNames(styles.Action, className)}
			tabIndex={0}
			style={{
				...style,
				cursor,
				'--fill': active && active.fill,
				'--background': active && active.background,
			}}
		/>
	);
});
