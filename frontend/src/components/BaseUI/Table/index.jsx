import { TableRowsLoader } from 'components/Loader';
import cn from 'classnames';
import { FormattedMessage } from 'react-intl';
import module from './style.module.scss';

export function Table({
	border = false,
	nowrap = false,
	striped = false,
	hover = false,
	fixed = false,
	editContent = false,
	auto = false,
	children,
	...props
}) {
	const classNames = cn(module['table'], {
		[module['table-border']]: border,
		[module['table-nowrap']]: nowrap,
		[module['table-striped-columns']]: striped,
		[module['table-hover']]: hover,
		[module['table-fixed']]: fixed,
		[module['table-auto']]: auto,
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

export function TableBody({
	list = [],
	isLoading,
	rows = 10,
	columns = 6,
	idIntl = 'common.no_results_found',
	children = null,
}) {
	const { 'tbody-empty': emptyCln } = module;
	const classNames = cn({
		[emptyCln]: !list.length,
	});

	return (
		<tbody className={classNames}>
			{isLoading ? (
				<TableRowsLoader rows={rows} columns={columns} />
			) : list.length ? (
				list.map(children)
			) : (
				<tr className='text-center text-muted text-italic'>
					<td colSpan={columns}>
						<FormattedMessage id={idIntl} />
					</td>
				</tr>
			)}
		</tbody>
	);
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
