import { htmlContentApi } from 'api';
import {
	Button,
	ConfirmModal,
	Container,
	ContainerGrid,
	Dropdown,
	FooterContainer,
	FormattedDescription,
	SortableTableHeader,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
} from 'components';
import { useAsyncLocation, useAuth, useIndex, useToggle } from 'hooks';
import produce from 'immer';
import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { compose, firstCapitalize, formatDate, showToastMessage, tryCatch, tryCatchAndToast } from 'utils';
import { HtmlContentModal } from '../../components';

export default function HtmlContentManager() {
	const {
		info: { languageId },
	} = useAuth();

	const {
		data: HtmlContents,
		isLoading,
		queryParams,
		totalPages,
		setData: updateHtmlContents,
		handlePageChange,
		handleChangeSort,
		handleSelect,
	} = useAsyncLocation({
		fetch: htmlContentApi.getByQueryParams,
		parameters: {
			page_type: 'home',
			page_position: 'main',
		},
	});

	const [configs, setConfigs] = useState({});

	const pageTypes = configs?.PAGE_TYPES || [];

	const pagePositions = configs?.PAGE_POSITIONS || [];
	const pagePositionOptions = configs?.PAGE_POSITIONS?.filter((option) => option.value !== 'all') || [];

	const { index: htmlContentIndex, setIndex: setHtmlContentIndex } = useIndex();
	const htmlContentCurrent = HtmlContents.length ? HtmlContents[htmlContentIndex] : {};

	const [isOpenContentModal, toggleHtmlContentModal] = useToggle();
	const [isOpenConfirmModal, toggleConfirmModal] = useToggle();

	const handleOpenHtmlContentModal = compose(setHtmlContentIndex, toggleHtmlContentModal);
	const handleOpenConfirmModal = compose(setHtmlContentIndex, toggleConfirmModal);

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

	const handleDeleteHtmlContent = tryCatchAndToast(async () => {
		if (htmlContentCurrent._id) {
			const { message, metadata } = await htmlContentApi.deleteOneById(htmlContentCurrent._id);

			if (htmlContentCurrent?._id === metadata._id) {
				updateHtmlContents(
					produce((draft) => {
						draft.splice(htmlContentIndex, 1);
					}),
				);
			}

			showToastMessage(message, languageId);
			toggleConfirmModal();
		}
	}, languageId);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await htmlContentApi.getConfigs();
			setConfigs(metadata);
		})();
	}, []);

	return (
		<>
			<Container id='page-main' className='py-5'>
				<ContainerGrid>
					<div className='row pb-4'>
						<div className='col-6'>
							<div className='d-flex gap-2'>
								<Dropdown
									value={queryParams?.page_type}
									size='lg-md'
									name='page_type'
									options={pageTypes}
									onSelect={handleSelect}
								/>
								<Dropdown
									value={queryParams?.page_position}
									size='lg-md'
									name='page_position'
									options={pagePositions}
									onSelect={handleSelect}
								/>
							</div>
						</div>
						<div className='col-6 d-flex'>
							<Button square size='sm' className='ms-auto' onClick={() => handleOpenHtmlContentModal(-1)}>
								<MdAdd size='1.25em' />
							</Button>
						</div>
					</div>
					<TableGrid className='scrollbar'>
						<Table hover striped fixed>
							<TableHeader>
								<th className='text-center' style={{ width: '80px' }}>
									<FormattedMessage id='table.no' />
								</th>
								<SortableTableHeader
									name='title'
									intl='common.title.default'
									onChange={handleChangeSort}
									style={{ width: '440px' }}
								/>
								<SortableTableHeader
									name='positionType'
									intl='common.position'
									className='text-center'
									onChange={handleChangeSort}
									style={{ width: '120px' }}
								/>
								<SortableTableHeader
									className='text-center'
									name='index'
									intl='table.index'
									onChange={handleChangeSort}
									style={{ width: '120px' }}
								/>
								<SortableTableHeader
									name='createdAt'
									intl='common.created_at'
									className='text-center'
									onChange={handleChangeSort}
									style={{ width: '180px' }}
								/>
								<th className='text-center' style={{ width: '240px' }}>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody list={HtmlContents} isLoading={isLoading} rows={10} columns={6}>
								{({ _id, title, positionType, index: htmlContentIndex, createdAt }, index) => (
									<tr key={_id}>
										<td className='text-center'>{index + 1}</td>
										<td>{title[languageId]}</td>
										<td className='text-center'>{firstCapitalize(positionType)}</td>
										<td className='text-center'>{htmlContentIndex}</td>
										<td className='text-center'>{formatDate(createdAt)}</td>
										<td>
											<div className='d-flex justify-content-center gap-2'>
												<Button success size='xs' info onClick={() => handleOpenHtmlContentModal(index)}>
													<FormattedMessage id='button.update' />
												</Button>
												<Button size='xs' danger onClick={() => handleOpenConfirmModal(index)}>
													<FormattedMessage id='button.delete' />
												</Button>
											</div>
										</td>
									</tr>
								)}
							</TableBody>
						</Table>
					</TableGrid>
					<FooterContainer
						pagesize={queryParams.pagesize || 25}
						totalPages={totalPages}
						currentPage={+queryParams.page - 1}
						handlePageChange={handlePageChange}
						handleSelect={handleSelect}
					/>
				</ContainerGrid>
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
			<ConfirmModal
				isOpen={isOpenConfirmModal}
				idTitleIntl='dashboard.modules.html_content.modal.deletion.title'
				onClose={toggleConfirmModal}
				onSubmit={handleDeleteHtmlContent}
			>
				<FormattedDescription
					id='dashboard.modules.html_content.modal.deletion.description'
					values={{ title: htmlContentCurrent?.title?.[languageId] || '' }}
				/>
			</ConfirmModal>
		</>
	);
}
