import { bookingApi } from '@/admin/service';
import {
	Button,
	ConfirmModal,
	Container,
	DatePickerRange,
	Dropdown,
	DropdownIntl,
	FooterContainer,
	SortableTableHeader,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
	UnFieldDebounce,
} from '@/admin/components';
import {
	DATE_FORMAT_QUERY,
	DEFAULT_DATE,
	PATIENT_SEARCH_OPTIONS,
	SPECIALTY_ID_DEFAULT,
	STATUS_ID_DEFAULT,
	WORKING_HOUR_ID_DEFAULT,
} from '@/admin/constant';
import { useAsyncLocation, useFetchSpecialty, useToggle } from '@/admin/hooks';
import { compose } from '@/admin/utilities';
import { useAuth } from '@/hooks';
import { FormattedDescription } from '@/shared/components';
import { formatPhone } from '@/utils';
import produce from 'immer';
import moment from 'moment';
import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { BookingModel } from '../../components';

export function BookingManager() {
	const { languageId } = useAuth();
	const bookingIndex = useRef(0);

	const {
		data: Bookings,
		setData: setBookings,
		searchBy,
		queryParams,
		handleOnSort,
		handleOnSelect,
		setQueryParams,
		handleOnPageChange,
		handleOnChangeSearch,
	} = useAsyncLocation({
		fetchFnc: bookingApi.getAll,
		params: {
			specialtyId: SPECIALTY_ID_DEFAULT,
			workingHourId: WORKING_HOUR_ID_DEFAULT,
			statusId: STATUS_ID_DEFAULT,
			startDate: DEFAULT_DATE,
		},
	});

	const convertToOptions = (response) =>
		response.map((response) => ({ value: response.statusId, label: response[`value_${languageId}`] }));

	const { Statuses } = {};

	const { WorkingHours } = {};

	const { memorizedOptions: Specialties, updateSpecialties } = useFetchSpecialty({ language: languageId });

	const [statusConfirmModal, toggleConfirmDeletion] = useToggle();
	const [statusModalBooking, toggleModalBooking] = useToggle();

	const updateBookingIndex = (index) => {
		if (bookingIndex.current !== index) {
			bookingIndex.current = index;
		}
	};

	const openConfirmModal = compose(updateBookingIndex, toggleConfirmDeletion);
	const openModalBooking = compose(updateBookingIndex, toggleModalBooking);

	const handleSelectRangeDates = (dates) => {
		const [start, end] = dates;
		const startDate = start ? moment(start, DATE_FORMAT_QUERY) : moment(DEFAULT_DATE);
		const endDate = end ? moment(end, DATE_FORMAT_QUERY) : null;
		const isSameDate = endDate && endDate.isSame(startDate);

		setQueryParams({
			startDate: startDate.format(DATE_FORMAT_QUERY),
			endDate: !isSameDate && endDate ? endDate.format(DATE_FORMAT_QUERY) : '',
		});
	};

	const handleConfirmDeletionBooking = async () => {
		try {
			const index = bookingIndex.current;
			const bookingId = Bookings[index].bookingId;
			const { message } = await bookingApi.deleteOne(bookingId);
			toast.success(message[languageId]);
			setBookings(
				produce((draft) => {
					draft.splice(index, 1);
				}),
			);
			bookingIndex.current = 0;
			toggleConfirmDeletion(false);
		} catch (error) {
			toast.error(error.message[languageId]);
		}
	};

	const handleUpdateBooking = async (data) => {
		delete data.isSelected;
		try {
			const { message } = await bookingApi.updateOne(data);
			const needUpdateSpecialties = data.specialtyId !== queryParams.specialtyId;

			setBookings(
				produce((draft) => {
					const index = bookingIndex.current;
					if (needUpdateSpecialties || data.workingHourId !== queryParams.wkId || data.statuesId !== queryParams.stId) {
						draft.splice(index, 1);
					} else {
						draft[bookingIndex.current] = { ...data };
					}
				}),
			);

			if (needUpdateSpecialties) {
				updateSpecialties(
					produce((draft) => {
						const prevIndex = draft.findIndex((specialty) => specialty.value === queryParams.specialtyId);
						const index = draft.findIndex((specialty) => specialty.value === data.specialtyId);
						draft[prevIndex].totalDoctors -= 1;
						draft[index].totalDoctors += 1;
					}),
				);
			}

			toggleModalBooking();
			toast.success(message[languageId]);
		} catch (error) {
			toast.error(error.message[languageId]);
		}
	};

	return (
		<React.Fragment>
			<Container id='page-main'>
				<div className='d-flex flex-column h-100 py-5'>
					<div className='row position-relative pb-4 z-index-2'>
						<div className='col-6'>
							<div className='d-flex items-end gap-2'>
								<Dropdown
									showCounter
									size='md'
									name='specialtyId'
									options={Specialties}
									value={queryParams.specialtyId}
									onSelect={handleOnSelect}
								/>
								<div className='d-flex'>
									<DropdownIntl
										name='search_by'
										options={PATIENT_SEARCH_OPTIONS}
										value={searchBy}
										onSelect={handleOnSelect}
									/>
									<UnFieldDebounce
										delay={500}
										onChange={handleOnChangeSearch}
										initialValue={queryParams.search || ''}
										type='text'
										placeholderIntl='form.search_placeholder'
										ariallabel='search field'
										id='form-search'
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
									onSelect={handleOnSelect}
								/>
								<Dropdown name='statusId' value={queryParams.statusId} options={Statuses} onSelect={handleOnSelect} />
							</div>
						</div>
					</div>
					<TableGrid className='scrollbar'>
						<Table hover striped auto>
							<TableHeader>
								<th className='text-center'>
									<FormattedMessage id='table.no' />
								</th>
								<SortableTableHeader
									className='text-start'
									orders={queryParams.sort}
									name='fullName'
									intl='form.fullName'
									onChange={handleOnSort}
								/>
								<th className='text-start'>
									<FormattedMessage id='form.phone' />
								</th>
								<SortableTableHeader
									className='text-start'
									orders={queryParams.sort}
									name='email'
									intl='form.email'
									onChange={handleOnSort}
								/>
								<th className='text-start'>
									<FormattedMessage id='form.address' />
								</th>
								<th className='text-center'>
									<FormattedMessage id='table.actions' />
								</th>
							</TableHeader>
							<TableBody>
								{Bookings.map(({ bookingId, fullName, email, phone, address }, index) => (
									<tr key={bookingId}>
										<td className='text-center'>{index + 1}</td>
										<td>{fullName ?? ''}</td>
										<td>{formatPhone(phone)}</td>
										<td>{email}</td>
										<td>{address}</td>
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
						per_page={queryParams.per_page}
						totalPages={queryParams.totalPages}
						handleOnSelect={handleOnSelect}
						handleOnPageChange={handleOnPageChange}
					/>
				</div>
			</Container>
			<ConfirmModal
				idTitleIntl='dashboard.booking.modal.confirm_deletion_booking.title'
				isOpen={statusConfirmModal}
				onClose={toggleConfirmDeletion}
				onSubmit={handleConfirmDeletionBooking}>
				<FormattedDescription
					id='dashboard.booking.modal.confirm_deletion_booking.message'
					values={{ email: Bookings[bookingIndex.current]?.email ?? '' }}
				/>
			</ConfirmModal>
			<BookingModel
				idTitleIntl='dashboard.booking.modal.update_booking.title'
				defaultValues={Bookings[bookingIndex.current]}
				languageId={languageId}
				specialties={Specialties}
				specialtyId={queryParams.specialtyId}
				workingHours={WorkingHours}
				statuses={Statuses}
				isOpen={statusModalBooking}
				onClose={toggleModalBooking}
				onSubmit={handleUpdateBooking}
			/>
		</React.Fragment>
	);
}
