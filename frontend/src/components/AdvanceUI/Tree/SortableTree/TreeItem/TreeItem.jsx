import React from 'react';
import classNames from 'classnames';
import { MdExpandMore } from 'react-icons/md';
import styles from './style.module.scss';
import { Action, Handle, Remove, Update } from '../Buttons';

export const TreeItem = React.forwardRef(
	(
		{
			childCount,
			clone,
			depth,
			disableSelection,
			disableInteraction,
			ghost,
			handleProps,
			indentationWidth,
			indicator,
			collapsed,
			onCollapse,
			onUpdate,
			onRemove,
			style,
			value,
			wrapperRef,
			...props
		},
		ref,
	) => {
		return (
			<li
				className={classNames(
					styles.Wrapper,
					clone && styles.clone,
					ghost && styles.ghost,
					indicator && styles.indicator,
					disableSelection && styles.disableSelection,
					disableInteraction && styles.disableInteraction,
				)}
				ref={wrapperRef}
				style={{
					'--spacing': `${indentationWidth * depth}px`,
				}}
				{...props}
			>
				<div className={styles.TreeItem} ref={ref} style={style}>
					<Handle {...handleProps} />
					{onCollapse && (
						<Action onClick={onCollapse} className={classNames(styles.Collapse, collapsed && styles.collapsed)}>
							<MdExpandMore size='1.25em' />
						</Action>
					)}
					<span className={styles.Text}>{value}</span>
					<Update onClick={onUpdate} />
					{!clone && onRemove && <Remove onClick={onRemove} />}
					{clone && childCount && childCount > 1 ? <span className={styles.Count}>{childCount}</span> : null}
				</div>
			</li>
		);
	},
);
