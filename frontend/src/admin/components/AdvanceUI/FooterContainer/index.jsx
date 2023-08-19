import { FormattedMessage } from 'react-intl';
import { PaginationSelector } from '../PaginationSelector';
import { PAGINATION_OPTIONS } from '@/admin/constant';
import { BasePagination } from '@/shared/components';

export function FooterContainer({
	pagesize = 25,
	totalPages = 1,
	handleOnSelect = () => null,
	handleOnPageChange = () => null,
}) {
	return (
		<div className='d-flex justify-content-between pt-6'>
			<div className='d-flex align-items-center gap-2'>
				<span className='text-size-xs'>
					<FormattedMessage id='table.show' />
				</span>
				<PaginationSelector
					name='pagesize'
					data-parent='page-main'
					size='sm'
					paginationNumbers={PAGINATION_OPTIONS}
					perPage={+pagesize || 25}
					onSelect={handleOnSelect}
				/>
				<span className='text-size-xs'>
					<FormattedMessage id='table.entries' />
				</span>
			</div>
			<BasePagination pageCount={+totalPages} onPageChange={handleOnPageChange} />
		</div>
	);
}
