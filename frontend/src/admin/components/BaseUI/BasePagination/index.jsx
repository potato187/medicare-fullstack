import cn from 'classnames';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import ReactPaginate from 'react-paginate';
import module from './style.module.scss';

export function BasePagination({ className = '', variant = 'center', pageCount = 1, ...props }) {
	const { pagination: paginationClass, end: endClass, 'page-item': pageItemClass, 'page-link': pageLinkClass } = module;

	const styles = cn(
		paginationClass,
		{
			[endClass]: variant === 'end',
		},
		className,
	);
	return (
		<ReactPaginate
			nextLabel={<MdNavigateNext />}
			previousLabel={<MdNavigateBefore />}
			pageClassName={pageItemClass}
			pageLinkClassName={pageLinkClass}
			previousClassName={pageItemClass}
			previousLinkClassName={pageLinkClass}
			nextClassName={pageItemClass}
			nextLinkClassName={pageLinkClass}
			breakLabel='...'
			breakClassName={pageItemClass}
			breakLinkClassName={pageLinkClass}
			containerClassName={styles}
			activeClassName='active'
			marginPagesDisplayed={2}
			pageRangeDisplayed={3}
			pageCount={+pageCount}
			{...props}
		/>
	);
}
