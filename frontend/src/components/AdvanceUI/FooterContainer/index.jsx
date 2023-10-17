import { FormattedMessage } from 'react-intl';
import { PAGINATION_OPTIONS } from 'constant';
import { BasePagination, Divider } from 'components/BaseUI';
import { PaginationSelector } from '../PaginationSelector';

export function FooterContainer({
	pagesize = 25,
	currentPage = 0,
	totalPages = 1,
	handleSelect = (f) => f,
	handlePageChange = (f) => f,
}) {
	return (
		<div>
			<Divider />
			<div className='row pt-2'>
				<div className='col-auto col-sm-6'>
					<div className='d-flex align-items-center gap-2'>
						<span className='text-size-xs d-none d-sm-inline'>
							<FormattedMessage id='table.show' />
						</span>
						<PaginationSelector
							name='pagesize'
							data-parent='page-main'
							paginationNumbers={PAGINATION_OPTIONS}
							perPage={+pagesize || 25}
							onSelect={handleSelect}
						/>
						<span className='text-size-xs d-none d-sm-inline'>
							<FormattedMessage id='table.entries' />
						</span>
					</div>
				</div>
				<div className='col-auto flex-grow-1 col-sm-6'>
					<div className='d-flex justify-content-end'>
						<BasePagination forcePage={+currentPage} pageCount={totalPages} onPageChange={handlePageChange} />
					</div>
				</div>
			</div>
		</div>
	);
}
