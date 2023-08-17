import cn from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import module from './style.module.scss';

export function HeaderBreadcrumb({ breadcrumb = [] }) {
	const { breadcrumb: breadcrumbCln, breadcrumb__title: titleCln, breadcrumb__list: listCln } = module;
	return (
		<nav className={breadcrumbCln}>
			<h1 className={cn(titleCln, 'mb-0 text-uppercase')}>
				<FormattedMessage id={breadcrumb.at(-1).intl} />
			</h1>
			<ul className={listCln}>
				{breadcrumb.map(({ url = '', intl = '' }, index) => (
					<li key={index}>
						<Link className='text-capitalize' to={'/' + url}>
							<FormattedMessage id={intl} />
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
