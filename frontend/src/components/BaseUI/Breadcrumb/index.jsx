import cn from 'classnames';

export function Breadcrumb({ breadcrumb = [], wrap, children }) {
	const classNames = cn('theme-breadcrumb__list', {
		'flex-wrap': wrap,
	});

	return breadcrumb.length ? (
		<nav className='theme-breadcrumb'>
			<ul className={classNames}>{breadcrumb.map(children)}</ul>
		</nav>
	) : null;
}
