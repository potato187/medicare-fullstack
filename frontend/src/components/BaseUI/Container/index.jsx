import cn from 'classnames';
import module from './style.module.scss';

export function Container({ className = '', noPadding = false, transparent = false, children, ...props }) {
	const { container: containerCln, 'padding-none': pNoneCln, transparent: transparentCln } = module;

	const styles = cn(
		'container h-100',
		containerCln,
		{
			[pNoneCln]: noPadding,
			[transparentCln]: transparent,
		},

		className,
	);
	return (
		<div className={styles} {...props}>
			{children}
		</div>
	);
}

export function ContainerTitle({ className = '', children, ...props }) {
	const styles = cn(module['container-title'], className);
	return (
		<div className={styles} {...props}>
			{children}
		</div>
	);
}

export function ContainerMain({ className = '', children, ...props }) {
	const styles = cn(module['container-main'], className);
	return (
		<div className={styles} {...props}>
			{children}
		</div>
	);
}
