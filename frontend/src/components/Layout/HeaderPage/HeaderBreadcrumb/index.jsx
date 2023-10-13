import { useDocumentTitle } from 'hooks';
import cn from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import module from './style.module.scss';

export function HeaderBreadcrumb({ breadcrumb = [] }) {
	const intl = useIntl();
	const title = intl.formatMessage({ id: breadcrumb.at(-1).intl });
	const { breadcrumb: breadcrumbCln, breadcrumb__title: titleCln, breadcrumb__list: listCln } = module;

	const classNames = cn('theme-breadcrumb', breadcrumbCln);

	useDocumentTitle(title, [title]);

	return (
		<nav className={classNames}>
			<h1 className={cn(titleCln, 'mb-0 text-uppercase')}>{title}</h1>
			<ul className={cn('theme-breadcrumb__list', listCln)}>
				{breadcrumb.map(({ url = '', intl = '' }) => (
					<li key={url}>
						<Link className='text-capitalize' to={`/${url}`}>
							<FormattedMessage id={intl} />
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
