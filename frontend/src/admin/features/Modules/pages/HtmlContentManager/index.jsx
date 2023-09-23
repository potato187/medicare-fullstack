import { htmlContentApi } from 'admin/api';
import { HTML_CONTENT_PATH } from 'admin/api/constant';
import {
	Button,
	Container,
	Dropdown,
	FooterContainer,
	SortableTableHeader,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
} from 'admin/components';
import { useAsyncLocation, useGet, useIndex, useToggle } from 'admin/hooks';
import { compose, showToastMessage, tryCatchAndToast } from 'admin/utilities';
import { useAuth } from 'hooks';
import produce from 'immer';
import { MdAdd } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { firstCapitalize, formatDate } from 'utils';
import { HtmlContentModal } from '../../components';

export function HtmlContentManager() {
	const {
		info: { languageId },
	} = useAuth();

	const {
		data: HtmlContents,
		queryParams,
		totalPages,
		setData: updateHtmlContents,
		handleOnPageChange,
		handleOnChangeSort,
		handleOnSelect,
	} = useAsyncLocation({
		fetch: htmlContentApi.getByQueryParams,
		parameters: {
			page_type: 'home',
			page_position: 'main',
		},
	});

	const configs = useGet({
		endPoint: `${HTML_CONTENT_PATH}/configs`,
	});

	const pageTypes = configs?.PAGE_TYPES || [];

	const pagePositions = configs?.PAGE_POSITIONS || [];
	const pagePositionOptions = configs?.PAGE_POSITIONS?.filter((option) => option.value !== 'all') || [];

	const { index: htmlContentIndex, setIndex: setHtmlContentIndex } = useIndex();
	const [isOpenContentModal, toggleHtmlContentModal] = useToggle();
	const handleOpenHtmlContentModal = compose(setHtmlContentIndex, toggleHtmlContentModal);

	const htmlContentCurrent = HtmlContents.length ? HtmlContents[htmlContentIndex] : {};

	const handleUpdateHtmlContent = tryCatchAndToast(async (data) => {
		const { metadata, message } = await htmlContentApi.updateOneById(htmlContentCurrent._id, data);

		updateHtmlContents(
			produce((draft) => {
				Object.entries(metadata).forEach(([key, value]) => {
					if (Object.hasOwn(draft[htmlContentIndex], key)) {
						draft[htmlContentIndex][key] = value;
					}
				});
			}),
		);

		showToastMessage(message, languageId);
		toggleHtmlContentModal();
	}, languageId);

	const handleCreateHtmlContent = tryCatchAndToast(async (data) => {
		const { _id, ...body } = data;
		const { metadata, message } = await htmlContentApi.createOne(body);
		const { page_type, pagesize, positionType } = queryParams;

		if (
			HtmlContents.length < pagesize &&
			metadata?.pageType.includes(page_type) &&
			metadata.positionType === positionType
		) {
			updateHtmlContents(
				produce((draft) => {
					draft.push(metadata);
				}),
			);
		}

		showToastMessage(message, languageId);
		toggleHtmlContentModal(-1);
	}, languageId);

	return (
		<>
			<Container>
				<div className='d-flex flex-column h-100 py-5'>
					<div className='d-flex pb-4'>
						<div className='d-flex gap-2'>
							<Dropdown
								value={queryParams?.page_type}
								size='md'
								name='page_type'
								options={pageTypes}
								onSelect={handleOnSelect}
							/>
							<Dropdown
								value={queryParams?.page_position}
								size='md'
								name='page_position'
								options={pagePositions}
								onSelect={handleOnSelect}
							/>
						</div>
						<div className='px-5 d-flex gap-2 ms-auto'>
							<Button size='sm' onClick={() => handleOpenHtmlContentModal(-1)}>
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
								<SortableTableHeader name='title' intl='common.title.default' onChange={handleOnChangeSort} />
								<SortableTableHeader
									className='text-center'
									name='index'
									intl='table.index'
									onChange={handleOnChangeSort}
								/>
								<SortableTableHeader
									name='positionType'
									intl='common.position'
									className='text-center'
									onChange={handleOnChangeSort}
								/>
								<SortableTableHeader
									name='createdAt'
									intl='common.created_at'
									className='text-center'
									onChange={handleOnChangeSort}
								/>
								<th className='text-center'>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody>
								{HtmlContents.map(({ _id, title, positionType, index: htmlContentIndex, createdAt }, index) => (
									<tr key={_id}>
										<td className='text-center'>{index + 1}</td>
										<td>{title[languageId]}</td>
										<td className='text-center'>{htmlContentIndex}</td>
										<td className='text-center'>{firstCapitalize(positionType)}</td>
										<td className='text-center'>{formatDate(createdAt)}</td>
										<td>
											<div className='d-flex justify-content-center gap-2'>
												<Button success size='xs' info onClick={() => handleOpenHtmlContentModal(index)}>
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
					<FooterContainer
						pagesize={queryParams.pagesize || 25}
						totalPages={totalPages}
						currentPage={+queryParams.page - 1}
						handleOnPageChange={handleOnPageChange}
						handleOnSelect={handleOnSelect}
					/>
				</div>
			</Container>
			<HtmlContentModal
				isOpen={isOpenContentModal}
				htmlContentId={htmlContentCurrent?._id}
				pages={pageTypes}
				typePositions={pagePositionOptions}
				onClose={toggleHtmlContentModal}
				onUpdate={handleUpdateHtmlContent}
				onCreate={handleCreateHtmlContent}
			/>
		</>
	);
}
