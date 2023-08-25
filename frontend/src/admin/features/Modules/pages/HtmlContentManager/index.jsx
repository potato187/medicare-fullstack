import { MdAdd } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { htmlContentApi } from 'admin/api';
import {
	Button,
	Container,
	Dropdown,
	FooterContainer,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
	SortableTableHeader,
} from 'admin/components';

import { useAsyncLocation, useQuery, useToggle } from 'admin/hooks';
import { useAuth } from 'hooks';
import { formatDate } from 'utils';
import { HtmlContentModal } from '../../components';

export function HtmlContentManager() {
	const { languageId } = useAuth();
	const localValue = `value_${languageId}`;
	const localTitle = `title_${languageId}`;
	const htmlContentIndexRef = useRef(-1);

	const {
		data: HtmlContents,
		queryParams,
		handleOnSelect,
		handleOnSort,
	} = useAsyncLocation({
		fetchFnc: htmlContentApi.getByParams,
		params: {
			pageId: 'HMP',
			typePositionId: 'TP',
			search: '',
			search_by: 'all',
			sort: [],
		},
	});

	const convertToOptions = (data) => {
		return data.map((item) => ({ value: item.id, label: item[localValue] }));
	};

	const { Pages } = useQuery(
		'Pages',
		{
			from: 'page',
			attributes: ['id', 'value_vi', 'value_en'],
			order: [['index', 'asc']],
		},
		convertToOptions,
		[languageId],
	);

	const { TypePositions } = useQuery(
		'TypePositions',
		{
			from: 'typePosition',
			attributes: ['id', 'value_vi', 'value_en'],
			order: [['index', 'asc']],
		},
		convertToOptions,
		[languageId],
	);

	const typePositionLabels = TypePositions?.reduce((hash, type) => ({ ...hash, [type.value]: type.label }), {});
	const [statusHtmlContentModal, toggleHtmlContentModal] = useToggle();
	const handleToggleHtmlContentModal = (index = -1) => {
		if (index !== htmlContentIndexRef.current) {
			htmlContentIndexRef.current = index;
		}
		toggleHtmlContentModal();
	};

	const handleOnSubmit = async (htmlContent) => {
		try {
			const { message } = await htmlContentApi.createOrUpdate(htmlContent);
			toast.success(message[languageId]);
		} catch (error) {
			toast.error(error.message[languageId]);
		}
	};

	return (
		<>
			<Container id='page-main'>
				<div className='d-flex flex-column h-100 py-5'>
					<div className='d-flex pb-4'>
						<div className='d-flex gap-2'>
							<Dropdown size='md' value={queryParams.pageId} name='pageId' options={Pages} onSelect={handleOnSelect} />
							<Dropdown
								size='md'
								value={queryParams.typePositionId}
								name='typePositionId'
								options={TypePositions}
								onSelect={handleOnSelect}
							/>
						</div>
						<div className='px-5 d-flex gap-2 ms-auto'>
							<Button size='sm' onClick={handleToggleHtmlContentModal}>
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
								<SortableTableHeader
									sortMap={queryParams.sort}
									name={localTitle}
									intl='common.title'
									onSort={handleOnSort}
								/>
								<SortableTableHeader
									className='text-center'
									sortMap={queryParams.sort}
									name='index'
									intl='table.index'
									onSort={handleOnSort}
								/>
								<th className='text-center'>
									<FormattedMessage id='common.position' />
								</th>
								<SortableTableHeader
									className='text-center'
									sortMap={queryParams.sort}
									name='createdAt'
									intl='common.created_at'
									onSort={handleOnSort}
								/>
								<th className='text-center'>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody>
								{HtmlContents.map(({ id, ...content }, index) => (
									<tr key={id}>
										<td className='text-center'>{index + 1}</td>
										<td>{content[localTitle]}</td>
										<td className='text-center'>{content.index}</td>
										<td className='text-center'>{typePositionLabels[content.typePositionId]}</td>
										<td className='text-center'>{formatDate(content.createdAt)}</td>
										<td>
											<div className='d-flex justify-content-center gap-2'>
												<Button success size='xs' info onClick={() => handleToggleHtmlContentModal(index)}>
													<FormattedMessage id='button.update' />
												</Button>
												<Button size='xs' danger>
													<FormattedMessage id='button.delete' />
												</Button>
											</div>
										</td>
									</tr>
								))}
							</TableBody>
						</Table>
					</TableGrid>

					<FooterContainer />
				</div>
			</Container>
			<HtmlContentModal
				htmlContentId={HtmlContents[htmlContentIndexRef.current]?.id}
				isOpen={statusHtmlContentModal}
				pages={Pages}
				typePositions={TypePositions}
				onClose={toggleHtmlContentModal}
				onSubmit={handleOnSubmit}
			/>
		</>
	);
}
