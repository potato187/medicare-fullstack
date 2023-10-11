export function Breadcrumb({ breadcrumb = [], children }) {
	return breadcrumb.length ? (
		<nav className='theme-breadcrumb'>
			<ul className='theme-breadcrumb__list'>{breadcrumb.map(children)}</ul>
		</nav>
	) : null;
}
