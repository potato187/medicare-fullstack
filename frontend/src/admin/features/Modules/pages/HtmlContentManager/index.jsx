import { htmlContentApi } from 'admin/api';
import { HTML_CONTENT_PATH } from 'admin/api/constant';
import {
	Button,
	Container,
	Dropdown,
	SortableTableHeader,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
} from 'admin/components';
import { useAsyncLocation, useGet } from 'admin/hooks';
import { useAuth } from 'hooks';
import { useMemo } from 'react';
import { MdAdd } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

export function HtmlContentManager() {
	const {
		info: { languageId },
	} = useAuth();

	/* 	const { data: HtmlContents, setData: updateHtmlContents } = useAsyncLocation({
		fetch: htmlContentApi.getByQueryParams,
		parameters: {
			page_type: 'home',
			page_position: 'main',
		},
	});
 */
	const configs = {};

	const pageTypes = useMemo(() => {
		return configs?.PAGE_TYPES?.map(({ value, label }) => ({ value, label: label[languageId] })) || [];
	}, [configs, languageId]);

	const pagePositions = useMemo(() => {
		return configs?.PAGE_POSITIONS?.map(({ value, label }) => ({ value, label: label[languageId] })) || [];
	}, [configs, languageId]);

	return (
		<Container>
			<div className='d-flex flex-column h-100 py-5'>
				<div className='d-flex pb-4'>
					<div className='d-flex gap-2'>
						<Dropdown size='md' name='page_type' options={pageTypes} />
						<Dropdown size='md' name='page_position' options={pagePositions} />
					</div>
					<div className='px-5 d-flex gap-2 ms-auto'>
						<Button size='sm'>
							<span>
								<FormattedMessage id='button.add' />
							</span>
							<MdAdd size='1.25em' className='ms-2' />
						</Button>
					</div>
				</div>
				<TableGrid className='scrollbar'>
					<Table hover striped auto>
						<TableHeader>
							<th className='text-center'>
								<FormattedMessage id='table.no' />
							</th>
							<SortableTableHeader intl='common.title.default' />
							<SortableTableHeader className='text-center' name='index' intl='table.index' />
							<th className='text-center'>
								<FormattedMessage id='common.position' />
							</th>
							<th className='text-center'>
								<FormattedMessage id='table.actions' />
							</th>
						</TableHeader>
						<TableBody></TableBody>
					</Table>
				</TableGrid>
			</div>
		</Container>
	);
}
