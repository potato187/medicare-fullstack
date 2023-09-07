import { bookingApi } from 'admin/api';
import { BOOKING_STATUS, DATE_FORMAT_QUERY, ORDER_NONE, PAGINATION_NUMBER_DEFAULT } from 'admin/constant';
import { useCurrentIndex, useFetchResource } from 'admin/hooks';
import { createURL, tryCatch } from 'admin/utilities';
import moment from 'moment';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { typeOf } from 'utils';

export const useManageBookings = (languageId = 'en') => {
	const Specialties = useFetchResource({
		endpoint: 'specialty',
		languageId,
	});

	const WorkingHours = useFetchResource({
		endpoint: 'workingHour',
		languageId,
	});

	const Genders = useFetchResource({
		endpoint: 'gender',
		languageId,
	});

	const Statuses = BOOKING_STATUS.map((status) => ({ ...status, label: status.label[languageId] }));

	const [bookings, setBookings] = useState([]);
	const [specialtyIndex, setSpecialtyIndex] = useState(0);
	const [workingHourIndex, setWorkingHourIndex] = useState(0);

	const [totalPages, setTotalPages] = useState(1);
	const { currentIndexRef, setCurrentIndex } = useCurrentIndex(0);

	const { pathname: locationPathName, search: locationSearch } = useLocation();
	const navigate = useNavigate();

	const queryParams = useMemo(() => {
		const { sort, page = 1, pagesize = PAGINATION_NUMBER_DEFAULT, ...params } = queryString.parse(locationSearch);

		if (Specialties?.[specialtyIndex]?.value) {
			params.specialtyId = Specialties[specialtyIndex].value;
		}

		if (WorkingHours?.[workingHourIndex]?.value) {
			params.workingHourId = WorkingHours[workingHourIndex].value;
		}

		if (!params.startDate) {
			params.startDate = moment().format(DATE_FORMAT_QUERY);
		}

		if (params.endDate) {
			params.endDate = moment(params.endDate).format(DATE_FORMAT_QUERY);
		}

		return {
			...params,
			sort: sort || [],
			page,
			pagesize,
		};
	}, [locationSearch, Specialties, specialtyIndex, WorkingHours, workingHourIndex]);

	const setQueryParams = useCallback(
		(newParams) => {
			const newQueryParams = { ...queryParams, ...newParams };

			if (!newQueryParams.key_search) {
				delete newQueryParams.key_search;
			}

			const newUrl = createURL({ url: locationPathName, query: newQueryParams });
			navigate(newUrl);
		},
		[queryParams, locationPathName, navigate],
	);

	const handleOnChangeSort = (key, direction) => {
		const sortItem = `${key},${direction}`;
		const sortList = typeOf(queryParams.sort) === 'string' ? [queryParams.sort] : queryParams.sort;
		const sortItemIndex = sortList.findIndex((item) => {
			return item.includes(key);
		});

		if (sortItemIndex > -1) {
			direction !== ORDER_NONE ? sortList.splice(sortItemIndex, 1, sortItem) : sortList.splice(sortItemIndex, 1);
		} else {
			sortList.push(sortItem);
		}

		setQueryParams({ sort: sortList });
	};

	const handleOnPageChange = ({ selected }) => {
		setQueryParams({ page: selected + 1 });
	};

	const handleOnSelect = ({ key, value }) => {
		setQueryParams({ [key]: value });
	};

	const handleOnChangeSearch = (str) => {
		setQueryParams({ key_search: str });
	};

	const handleSelectSpecialty = ({ value }) => {
		const index = Specialties.findIndex((specialty) => specialty.value === value);
		if (index > -1) {
			setSpecialtyIndex(index);
		}
	};

	const handleSelectWorkingHour = ({ value }) => {
		const index = WorkingHours.findIndex((workingHour) => workingHour.value === value);
		if (index > -1) {
			setWorkingHourIndex(index);
		}
	};

	const handleSelectRangeDates = (dates) => {
		const [start, end] = dates;
		const startDate = start ? moment(start, DATE_FORMAT_QUERY) : moment();
		const endDate = end ? moment(end, DATE_FORMAT_QUERY) : null;
		const isSameDate = endDate && endDate.isSame(startDate);

		setQueryParams({
			startDate: startDate.format(DATE_FORMAT_QUERY),
			endDate: !isSameDate && endDate ? endDate.format(DATE_FORMAT_QUERY) : '',
		});
	};

	useEffect(() => {
		setQueryParams(queryParams);
	}, [queryParams, setQueryParams]);

	useEffect(() => {
		tryCatch(async () => {
			if (Specialties.length) {
				const { metadata } = await bookingApi.queryByParameters(queryParams);
				setBookings(metadata.data.map((data) => ({ ...data })));
				setTotalPages(metadata.meta.totalPages);
			}
		})();
	}, [queryParams, Specialties]);

	return {
		Specialties,
		WorkingHours,
		Statuses,
		Genders,
		Bookings: bookings,
		currentBookingIndex: currentIndexRef.current,
		queryParams,
		totalPages,
		handleSelectRangeDates,
		setBookings,
		setBookingIndex: setCurrentIndex,
		handleOnSelect,
		handleOnPageChange,
		handleOnChangeSort,
		handleOnChangeSearch,
		handleSelectSpecialty,
		handleSelectWorkingHour,
	};
};
