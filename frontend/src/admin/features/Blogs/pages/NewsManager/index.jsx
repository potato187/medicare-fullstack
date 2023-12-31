import { newsApi } from 'api';
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
	UnFieldSwitch,
} from 'components';
import { useAsyncLocation, useAuth, useIndex, useToggle } from 'hooks';
import produce from 'immer';
import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { compose, firstCapitalize, showToastMessage, tryCatch, tryCatchAndToast } from 'utils';
import { NewsModal } from '../../components';

export default function NewsManager() {
	const {
		info: { languageId },
	} = useAuth();
	const [configs, setConfigs] = useState({
		pageTypes: [],
		positionTypes: [],
		sortTypes: [],
	});

	const { index, setIndex } = useIndex();
	const [statusModel, toggleModal] = useToggle();
	const [statusConfirmModal, toggleConfirmModal] = useToggle();
	const handleToggleModal = compose(toggleModal, setIndex);
	const handleToggleConfirmModal = compose(toggleConfirmModal, setIndex);

	const {
		data: News,
		queryParams,
		totalPages,
		isLoading,
		setData: updateNews,
		handlePageChange,
		handleSelect,
		handleChangeSort,
	} = useAsyncLocation({
		fetch: newsApi.getByQueryParams,
	});

	const handleCreate = tryCatchAndToast(async (data) => {
		const { message, metadata } = await newsApi.createOne(data);
		if (News.length < queryParams.pagesize) {
			updateNews(
				produce((draft) => {
					draft.push(metadata);
				}),
			);
		}
		showToastMessage(message, languageId);
		handleToggleModal();
	}, languageId);

	const handleUpdate = tryCatchAndToast(async (data) => {
		if (News[index]?._id) {
			const { message, metadata } = await newsApi.updateOneById(News[index]?._id, data);
			updateNews(
				produce((draft) => {
					Object.entries(metadata).forEach(([key, value]) => {
						if (Object.hasOwn(draft[index], key)) {
							draft[index][key] = value;
						}
					});
				}),
			);
			showToastMessage(message, languageId);
		}
	}, languageId);

	const handleDeletionConfirmation = tryCatchAndToast(async () => {
		const id = News[index]._id || null;
		if (id) {
			const { message } = await newsApi.deleteOneById(id);
			updateNews(
				produce((draft) => {
					draft.splice(index, 1);
				}),
			);
			showToastMessage(message, languageId);
		}
		handleToggleConfirmModal(-1);
	}, languageId);

	const handleToggleDisplay = tryCatchAndToast(async (event, index) => {
		const id = News[index]._id;
		if (id) {
			const isDisplay = !!event.target.checked;
			const { message } = await newsApi.updateOneById(id, { isDisplay });
			updateNews(
				produce((draft) => {
					draft[index].isDisplay = isDisplay;
				}),
			);
			showToastMessage(message, languageId);
		}
	}, languageId);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await newsApi.getConfig();
			if (Object.keys(metadata).length) {
				setConfigs(
					produce((draft) => {
						draft.pageTypes = metadata?.PAGE_TYPE;
						draft.positionTypes = metadata?.POSITION_TYPE;
						draft.sortTypes = metadata?.SORT_TYPE;
					}),
				);
			}
		})();
	}, []);

	return (
		<>
			<Container id='page-main' className='py-5'>
				<ContainerGrid>
					<div className='row pb-4 gx-2'>
						<div className='col-10 col-sm-6'>
							<div className='d-flex gap-2'>
								<Dropdown
									size='md'
									name='page_type'
									value={queryParams.page_type}
									options={configs.pageTypes}
									onSelect={handleSelect}
								/>
								<Dropdown
									size='md'
									name='page_position'
									value={queryParams.page_position}
									options={configs.positionTypes}
									onSelect={handleSelect}
								/>
							</div>
						</div>
						<div className='col-2 col-sm-6'>
							<div className='d-flex'>
								<Button size='sm' square className='ms-auto' onClick={() => handleToggleModal(-1)}>
									<MdAdd size='1.25em' />
								</Button>
							</div>
						</div>
					</div>

					<TableGrid className='scrollbar'>
						<Table hover striped fixed>
							<TableHeader>
								<th className='text-center' style={{ width: '80px' }}>
									<FormattedMessage id='table.no' />
								</th>
								<th style={{ width: '500px' }}>
									<FormattedMessage id='common.title.default' />
								</th>
								<SortableTableHeader
									className='text-center'
									name='index'
									intl='table.index'
									onChange={handleChangeSort}
									style={{ width: '120px' }}
								/>
								<SortableTableHeader
									name='positionType'
									intl='common.position'
									className='text-center'
									onChange={handleChangeSort}
									style={{ width: '120px' }}
								/>
								<SortableTableHeader
									name='isDisplay'
									intl='common.display'
									className='text-center'
									onChange={handleChangeSort}
									style={{ width: '120px' }}
								/>
								<th className='text-center' style={{ width: '240px' }}>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody isLoading={isLoading} list={News}>
								{({ _id, name, positionType, index: newsIndex, isDisplay }, index) => (
									<tr key={_id}>
										<td className='text-center'>{index + 1}</td>
										<td>{name[languageId]}</td>
										<td className='text-center'>{newsIndex}</td>
										<td className='text-center'>{firstCapitalize(positionType)}</td>
										<td className='text-center'>
											<UnFieldSwitch
												name={_id}
												checked={isDisplay}
												onChange={(event) => handleToggleDisplay(event, index)}
											/>
										</td>
										<td>
											<div className='d-flex justify-content-center gap-2'>
												<Button success size='xs' onClick={() => handleToggleModal(index)}>
													<FormattedMessage id='button.update' />
												</Button>
												<Button size='xs' danger onClick={() => handleToggleConfirmModal(index)}>
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

			<NewsModal
				isOpen={statusModel}
				newsId={News[index]?._id}
				positions={configs.positionTypes}
				pages={configs.pageTypes}
				orders={configs.sortTypes}
				onClose={toggleModal}
				onCreate={handleCreate}
				onUpdate={handleUpdate}
			/>

			<ConfirmModal
				isOpen={statusConfirmModal}
				idTitleIntl='dashboard.blogs.news.modal.deletion.title'
				onClose={toggleConfirmModal}
				onSubmit={handleDeletionConfirmation}
			>
				<FormattedDescription
					id='dashboard.blogs.news.modal.deletion.description'
					values={{ title: News[index]?.name?.[languageId] || '' }}
				/>
			</ConfirmModal>
		</>
	);
}
