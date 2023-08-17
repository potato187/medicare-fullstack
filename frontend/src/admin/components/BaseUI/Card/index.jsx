import module from './style.module.scss';
import cn from 'classnames';

export function Card({ className = '', children }) {
	const classes = cn(module['card'], className);
	return <div className={classes}>{children}</div>;
}

export function CardHeader({ className = '', children }) {
	const classes = cn(module['card-header'], className);
	return <div className={classes}>{children}</div>;
}

export function CardBody({ className = '', children }) {
	const classes = cn(module['card-body'], className);
	return <div className={classes}>{children}</div>;
}

export function CardFooter({ className = '', children }) {
	const classes = cn(module['card-footer'], className);
	return <div className={classes}>{children}</div>;
}
