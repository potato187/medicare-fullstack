import cn from 'classnames';
import module from './style.module.scss';

export function Table({
	border = false,
	nowrap = false,
	striped = false,
	hover = false,
	fixed = false,
	auto = false,
	editContent = false,
	children,
	...props
}) {
	const classNames = cn(module['table'], {
		[module['table-border']]: border,
		[module['table-nowrap']]: nowrap,
		[module['table-striped-columns']]: striped,
		[module['table-hover']]: hover,
		[module['table-fixed']]: fixed,
		[module['table-auto']]: fixed,
		[module['table-edit-content']]: editContent,
	});

	return (
		<table className={classNames} {...props}>
			{children}
		</table>
	);
}

export function TableHeader({ children, ...props }) {
	return (
		<thead {...props}>
			<tr>{children}</tr>
		</thead>
	);
}

export function TableBody({ children, ...props }) {
	return <tbody {...props}>{children}</tbody>;
}

export function TableResponsive({ className, children }) {
	return <div className={cn(module['table-responsive'], className)}>{children}</div>;
}

export function TableGrid({ className, children, ...props }) {
	const { 'table-grid': tableGridCln, 'table-wrapper': tableWrapperCln } = module;
	return (
		<div className={tableWrapperCln} {...props}>
			<div className={cn(tableGridCln, className)}>{children}</div>
		</div>
	);
}
