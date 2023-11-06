import { bookingApi } from 'api';
import {
	Badge,
	Button,
	ConfirmModal,
	Container,
	ContainerGrid,
	DatePickerRange,
	Dropdown,
	FooterContainer,
	FormattedDescription,
	SortableTableHeader,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
	UnFieldDebounce,
} from 'components';
import { useAuth, useToggle } from 'hooks';
import produce from 'immer';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { compose, formatDateToDDMMYYYY, formatPhone, isDateInRange, showToastMessage, tryCatchAndToast } from 'utils';
import { BookingModal } from '../../components';
import { useBookings } from '../../hooks/useBookings';

export default function BookingManager() {
	const {
		info: { languageId },
	} = useAuth();

	const {
		Bookings,
		bookingIndex,
		Specialties,
		WorkingHours,
		Statuses,
		StatusLabels,
		Genders,
		queryParams,
		totalPages,
		isLoading,
		handleChangeSort,
		handleSelectRangeDates,
		setBookings,
		setBookingIndex,
		handleSelect,
		handlePageChange,
		handleChangeSearch,
	} = useBookings({ languageId });

	const [statusConfirmModal, toggleConfirmDeletion] = useToggle();
	const [statusModalBooking, toggleModalBooking] = useToggle();

	const openConfirmModal = compose(setBookingIndex, toggleConfirmDeletion);
	const openModalBooking = compose(setBookingIndex, toggleModalBooking);

	const handleConfirmDeletionBooking = tryCatchAndToast(async () => {
		const { message } = await bookingApi.deleteOne(Bookings[bookingIndex]._id);

		setBookings(
			produce((draft) => {
				draft.splice(bookingIndex, 1);
			}),
		);

		setBookingIndex(-1);
		toast.success(message[languageId]);
		toggleConfirmDeletion(false);
	}, languageId);

	const handleUpdateBooking = tryCatchAndToast(async (body) => {
		const { _id, ...updateBody } = body;
		const { metadata, message } = await bookingApi.updateOne(_id, updateBody);

		const { status, workingHourId, specialtyId, appointmentDate } = metadata;
		const checkDateInRange = appointmentDate
			? isDateInRange(appointmentDate, queryParams.startDate, queryParams.endDate)
			: true;

		const shouldRemove =
			(status && status !== queryParams.status) ||
			(workingHourId && workingHourId !== queryParams.workingHourId) ||
			(specialtyId && specialtyId !== queryParams.specialtyId);

		setBookings(
			produce((draft) => {
				if (shouldRemove || !checkDateInRange) {
					draft.splice(bookingIndex, 1);
				} else {
					draft[bookingIndex] = { ...draft[bookingIndex], ...metadata };
				}
			}),
		);

		showToastMessage(message, languageId);
	}, languageId);

	return (
		<>
			<Container id='page-main' className='py-5'>
				<ContainerGrid>
					<div className='row position-relative pb-4 z-index-2'>
						<div className='col-12 col-lg-6 mb-4'>
							<div className='d-flex gap-2'>
								<Dropdown
									size='md'
									name='specialtyId'
									value={queryParams.specialtyId}
									options={Specialties}
									onSelect={handleSelect}
								/>
								<div className='d-flex'>
									<UnFieldDebounce
										delay={500}
										type='text'
										placeholderIntl='form.search_placeholder'
										ariallabel='search field'
										id='form-search'
										onChange={handleChangeSearch}
									/>
								</div>
							</div>
						</div>
						<div className='col-12 col-lg-6'>
							<div className='d-flex flex-wrap justify-content-lg-end gap-2'>
								<DatePickerRange
									languageId={languageId}
									startDate={queryParams.startDate}
									endDate={queryParams.endDate || null}
									onChange={handleSelectRangeDates}
								/>
								<Dropdown
									size='md'
									name='workingHourId'
									value={queryParams.workingHourId}
									options={WorkingHours}
									onSelect={handleSelect}
								/>
								<Dropdown name='status' options={Statuses} value={queryParams.status} onSelect={handleSelect} />
							</div>
						</div>
					</div>
					<TableGrid className='scrollbar'>
						<Table hover striped fixed>
							<TableHeader>
								<th className='text-center' style={{ width: '80px' }}>
									<FormattedMessage id='table.no' />
								</th>
								<SortableTableHeader
									className='text-start'
									name='fullName'
									intl='form.fullName'
									onChange={handleChangeSort}
									style={{ width: '220px' }}
								/>
								<th className='text-start' style={{ width: '180px' }}>
									<FormattedMessage id='form.phone' />
								</th>
								<th className='text-start' style={{ width: '180px' }}>
									<FormattedMessage id='form.address' />
								</th>
								<SortableTableHeader
									className='text-center'
									name='appointmentDate'
									intl='common.appointmentDate'
									onChange={handleChangeSort}
									style={{ width: '180px' }}
								/>
								<th className='text-center' style={{ width: '120px' }}>
									<FormattedMessage id='table.status' />
								</th>
								<th className='text-center' style={{ width: '220px' }}>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody list={Bookings} isLoading={isLoading} columns={7}>
								{({ _id, fullName, phone, address, status, appointmentDate }, index) => (
									<tr key={_id}>
										<td className='text-center'>{index + 1}</td>
										<td>{fullName}</td>
										<td>{formatPhone(phone)}</td>
										<td>{address}</td>
										<td className='text-center'>{formatDateToDDMMYYYY(new Date(appointmentDate))}</td>
										<td className='text-center'>
											<Badge color={status}>{StatusLabels[status]}</Badge>
										</td>
										<td>
											<div className='d-flex justify-content-center gap-2'>
												<Button success size='xs' info onClick={() => openModalBooking(index)}>
													<FormattedMessage id='button.update' />
												</Button>
												<Button size='xs' danger onClick={() => openConfirmModal(index)}>
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

			<BookingModal
				isOpen={statusModalBooking}
				bookingId={Bookings[bookingIndex]?._id}
				languageId={languageId}
				specialties={Specialties}
				workingHours={WorkingHours}
				statuses={Statuses}
				genders={Genders}
				onClose={toggleModalBooking}
				onSubmit={handleUpdateBooking}
			/>

			<ConfirmModal
				idTitleIntl='dashboard.booking.modal.deletion.title'
				isOpen={statusConfirmModal}
				onClose={toggleConfirmDeletion}
				onSubmit={handleConfirmDeletionBooking}
			>
				<FormattedDescription
					id='dashboard.booking.modal.deletion.message'
					values={{ phone: Bookings[bookingIndex]?.phone || '' }}
				/>
			</ConfirmModal>
		</>
	);
}
