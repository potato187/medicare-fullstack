import module from './style.module.scss';

export function Breadcrumb({ breadcrumb = [], children }) {
	if (!breadcrumb.length) {
		return null;
	}

	const { breadcrumb: breadcrumbCln, breadcrumb__list: listCln } = module;

	return (
		<nav className={breadcrumbCln}>
			<ul className={listCln}>{breadcrumb.map(children)}</ul>
		</nav>
	);
}
