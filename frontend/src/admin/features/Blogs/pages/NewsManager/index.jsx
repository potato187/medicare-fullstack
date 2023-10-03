import { newsApi } from 'admin/api';
import {
	Button,
	ConfirmModal,
	Container,
	Dropdown,
	FooterContainer,
	FormattedDescription,
	SortableTableHeader,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
	UnFieldSwitch,
} from 'admin/components';
import { useAsyncLocation, useIndex, useToggle } from 'admin/hooks';
import { compose, showToastMessage, tryCatch, tryCatchAndToast } from 'admin/utilities';
import { useAuth } from 'hooks';
import produce from 'immer';
import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { firstCapitalize } from 'utils';
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
		toggleConfirmModal(-1);
	}, languageId);

	const handleUpdate = tryCatchAndToast(async (data) => {
		if (News[index]?._id && Object.keys(data).length) {
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
		handleToggleModal(-1);
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
		toggleConfirmModal(-1);
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
			<Container id='page-main'>
				<div className='d-flex flex-column h-100 py-5'>
					<div className='d-flex pb-4'>
						<div className='d-flex items-end gap-2'>
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
						<div className='px-5 d-flex gap-2 ms-auto'>
							<Button size='sm' onClick={() => handleToggleModal(-1)}>
								<span>
									<FormattedMessage id='button.create' />
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
								<th>
									<FormattedMessage id='common.title.default' />
								</th>
								<SortableTableHeader
									className='text-center'
									name='index'
									intl='table.index'
									onChange={handleChangeSort}
								/>
								<SortableTableHeader
									name='positionType'
									intl='common.position'
									className='text-center'
									onChange={handleChangeSort}
								/>
								<SortableTableHeader
									name='isDisplay'
									intl='common.display'
									className='text-center'
									onChange={handleChangeSort}
								/>
								<th className='text-center'>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody>
								{News.map(({ _id, name, positionType, index: newsIndex, isDisplay }, index) => (
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
								))}
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
				</div>
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
				idTitleIntl='dashboard.blogs.news.modals.delete.title'
				onClose={toggleConfirmModal}
				onSubmit={handleDeletionConfirmation}
			>
				<FormattedDescription
					id='dashboard.blogs.news.modals.delete.description'
					values={{ title: News[index]?.name?.[languageId] || '' }}
				/>
			</ConfirmModal>
		</>
	);
}
