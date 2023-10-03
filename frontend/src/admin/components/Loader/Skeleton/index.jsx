import cn from 'classnames';
import module from './style.module.scss';

export function Skeleton({ height, width, variant = 'text', animation = 'wave' }) {
	const styles = {};
	const classNames = cn(module.skeleton, {
		[module.rounded]: variant === 'rounded',
		[module.rectangular]: variant === 'rectangular',
		[module.circular]: variant === 'circular',
		[module.wave]: animation === 'wave',
		[module.pulse]: animation === 'pulse',
	});

	if (height) {
		styles.height = height;
	}

	if (width) {
		styles.width = width;
	}

	return <span className={classNames} style={styles} />;
}
