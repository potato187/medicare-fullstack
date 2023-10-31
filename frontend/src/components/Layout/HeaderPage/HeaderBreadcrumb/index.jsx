import cn from 'classnames';
import { useDocumentTitle } from 'hooks';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { generateBreadcrumb } from '../utils';
import module from './style.module.scss';

export function HeaderBreadcrumb() {
	const location = useLocation();
	const intl = useIntl();
	const [breadcrumb, setBreadcrumb] = useState([]);
	const [title, setTitle] = useState('Medicare');

	const { breadcrumb: breadcrumbCln, breadcrumb__title: titleCln, breadcrumb__list: listCln } = module;
	const classNames = cn('theme-breadcrumb', breadcrumbCln);

	useEffect(() => {
		const breadcrumb = generateBreadcrumb(location.pathname);
		if (breadcrumb.length) {
			setBreadcrumb(breadcrumb);
			setTitle(intl.formatMessage({ id: breadcrumb.at(-1).intl }));
		}
	}, [location.pathname]);

	useDocumentTitle(title, [title]);

	return (
		<nav className={classNames}>
			<h1 className={cn(titleCln, 'mb-0 text-uppercase')}>{title}</h1>
			<ul className={cn('theme-breadcrumb__list', listCln)}>
				{breadcrumb.map(({ url = '', intl = '' }) => (
					<li key={url}>
						<span className='text-capitalize' to={`/${url}`} disabled>
							<span className=' text-nowrap'>
								<FormattedMessage id={intl} />
							</span>
						</span>
					</li>
				))}
			</ul>
		</nav>
	);
}
