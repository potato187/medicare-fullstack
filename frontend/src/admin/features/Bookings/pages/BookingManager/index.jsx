import { bookingApi } from 'admin/api';
import {
	Badge,
	Button,
	Container,
	Dropdown,
	FooterContainer,
	SortableTableHeader,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
	UnFieldDebounce,
} from 'admin/components';
import { BOOKING_STATUS } from 'admin/constant';
import { useAsyncLocation, useFetchResource } from 'admin/hooks';
import { useAuth } from 'hooks';
import { FormattedMessage } from 'react-intl';
import { formatPhone } from 'utils';

export function BookingManager() {
	const {
		info: { languageId },
	} = useAuth();

	const { data: Bookings } = useAsyncLocation({
		getData: bookingApi.getByParams,
	});

	const Specialties = useFetchResource({
		endpoint: 'specialty',
		languageId,
	});

	const WorkingHours = useFetchResource({
		endpoint: 'workingHour',
		languageId,
	});

	const Status = BOOKING_STATUS.map((status) => ({ ...status, label: status.label[languageId] }));

	return (
		<Container id='page-main'>
			<div className='d-flex flex-column h-100 py-5'>
				<div className='row position-relative pb-4 z-index-2'>
					<div className='col-6'>
						<div className='d-flex items-end gap-2'>
							<Dropdown size='md' name='specialtyId' options={Specialties} />
							<div className='d-flex'>
								<UnFieldDebounce
									delay={500}
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
							<Dropdown size='md' name='workingHourId' options={WorkingHours} />
							<Dropdown name='status' options={Status} />
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
								<FormattedMessage id='form.address' />
							</th>
							<th className='text-center'>
								<FormattedMessage id='table.actions' />
							</th>
						</TableHeader>
						<TableBody>
							{Bookings.map(({ _id, fullName, phone, address, isVerify }, index) => (
								<tr key={_id}>
									<td className='text-center'>{index + 1}</td>
									<td>{fullName}</td>
									<td>{formatPhone(phone)}</td>
									<td>{address}</td>
									<td className='text-center'>
										<Badge color={isVerify ? 'primary' : 'warning'}>
											<FormattedMessage id={`common.${isVerify ? 'verify' : 'unverified'}`} />
										</Badge>
									</td>
									<td>
										<div className='d-flex justify-content-center gap-2'>
											<Button success size='xs' info>
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

				<FooterContainer pagesize={25} totalPages={1} />
			</div>
		</Container>
	);
}
