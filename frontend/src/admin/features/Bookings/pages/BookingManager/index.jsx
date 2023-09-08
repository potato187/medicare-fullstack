import { bookingApi } from 'admin/api';
import {
	Badge,
	Button,
	ConfirmModal,
	Container,
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
} from 'admin/components';
import { useToggle } from 'admin/hooks';
import { compose, showToastMessage, tryCatchAndToast } from 'admin/utilities';
import { useAuth } from 'hooks';
import produce from 'immer';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { formatPhone } from 'utils';
import { BookingModel } from '../../components';
import { useManageBookings } from '../../hooks';

export function BookingManager() {
	const {
		info: { languageId },
	} = useAuth();

	const {
		Bookings,
		Specialties,
		WorkingHours,
		Statuses,
		Genders,
		currentBookingIndex,
		queryParams,
		totalPages,
		handleSelectRangeDates,
		setBookings,
		setBookingIndex,
		handleOnSelect,
		handleSelectSpecialty,
		handleSelectWorkingHour,
		handleOnPageChange,
		handleOnChangeSearch,
	} = useManageBookings(languageId);

	const currentBooking = Bookings.length ? Bookings[currentBookingIndex] : {};
	const statusLabels = Statuses.reduce((hash, { label, value }) => ({ ...hash, [value]: label }), {});

	const [statusConfirmModal, toggleConfirmDeletion] = useToggle();
	const [statusModalBooking, toggleModalBooking] = useToggle();

	const openConfirmModal = compose(setBookingIndex, toggleConfirmDeletion);
	const openModalBooking = compose(setBookingIndex, toggleModalBooking);

	const handleConfirmDeletionBooking = tryCatchAndToast(async () => {
		const { message } = await bookingApi.deleteOne(Bookings[currentBookingIndex]._id);

		setBookings(
			produce((draft) => {
				draft.splice(currentBookingIndex, 1);
			}),
		);

		setBookingIndex(0);
		toast.success(message[languageId]);
		toggleConfirmDeletion(false);
	}, languageId);

	const handleUpdateBooking = tryCatchAndToast(async (body) => {
		const { metadata, message } = await bookingApi.updateOne(currentBooking._id, body);

		setBookings(
			produce((draft) => {
				draft[currentBookingIndex] = { ...draft[currentBookingIndex], ...metadata };
			}),
		);

		showToastMessage(message, languageId);
		toggleModalBooking();
	}, languageId);

	return (
		<>
			<Container id='page-main'>
				<div className='d-flex flex-column h-100 py-5'>
					<div className='row position-relative pb-4 z-index-2'>
						<div className='col-6'>
							<div className='d-flex items-end gap-2'>
								<Dropdown
									size='md'
									name='specialtyId'
									value={queryParams.specialtyId}
									options={Specialties}
									onSelect={handleSelectSpecialty}
								/>
								<div className='d-flex'>
									<UnFieldDebounce
										delay={500}
										type='text'
										placeholderIntl='form.search_placeholder'
										ariallabel='search field'
										id='form-search'
										onChange={handleOnChangeSearch}
									/>
								</div>
							</div>
						</div>
						<div className='col-6'>
							<div className='d-flex justify-content-end gap-2'>
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
									onSelect={handleSelectWorkingHour}
								/>
								<Dropdown name='status' options={Statuses} value={queryParams.status} onSelect={handleOnSelect} />
							</div>
						</div>
					</div>
					<TableGrid className='scrollbar'>
						<Table hover striped auto>
							<TableHeader>
								<th className='text-center'>
									<FormattedMessage id='table.no' />
								</th>
								<SortableTableHeader className='text-start' name='fullName' intl='form.fullName' />
								<th className='text-start'>
									<FormattedMessage id='form.phone' />
								</th>
								<th className='text-start'>
									<FormattedMessage id='form.address' />
								</th>
								<th className='text-center'>
									<FormattedMessage id='table.status' />
								</th>
								<th className='text-center'>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody>
								{Bookings.map(({ _id, fullName, phone, address, status }, index) => (
									<tr key={_id}>
										<td className='text-center'>{index + 1}</td>
										<td>{fullName}</td>
										<td>{formatPhone(phone)}</td>
										<td>{address}</td>
										<td className='text-center'>
											<Badge color={status}>{statusLabels[status]}</Badge>
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

			<BookingModel
				idTitleIntl='dashboard.booking.modal.update_booking.title'
				defaultValues={currentBooking}
				languageId={languageId}
				specialtyId={queryParams.specialtyId}
				specialties={Specialties}
				workingHours={WorkingHours}
				statuses={Statuses}
				genders={Genders}
				isOpen={statusModalBooking}
				onClose={toggleModalBooking}
				onSubmit={handleUpdateBooking}
			/>

			<ConfirmModal
				idTitleIntl='dashboard.booking.modal.confirm_deletion_booking.title'
				isOpen={statusConfirmModal}
				onClose={toggleConfirmDeletion}
				onSubmit={handleConfirmDeletionBooking}
			>
				<FormattedDescription
					id='dashboard.booking.modal.confirm_deletion_booking.message'
					values={{ phone: currentBooking?.phone || '' }}
				/>
			</ConfirmModal>
		</>
	);
}
