import { bookingApi } from 'admin/api';
import { DATE_FORMAT, ORDER_NONE, PAGINATION_NUMBER_DEFAULT } from 'admin/constant';
import { useFetch, useIndex } from 'admin/hooks';
import { createURL, tryCatch } from 'admin/utilities';
import moment from 'moment';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { typeOf } from 'utils';

export const useFetchBookings = () => {
	const Specialties = useFetch({
		endpoint: 'specialty',
	});

	const WorkingHours = useFetch({
		endpoint: 'workingHour',
	});

	const Genders = useFetch({
		endpoint: 'gender',
	});

	const [bookings, setBookings] = useState([]);
	const [specialtyIndex, setSpecialtyIndex] = useState(0);
	const [workingHourIndex, setWorkingHourIndex] = useState(0);

	const [totalPages, setTotalPages] = useState(1);
	const { index: currentIndex, setIndex: setCurrentIndex } = useIndex(0);

	const { pathname: locationPathName, search: locationSearch } = useLocation();
	const navigate = useNavigate();

	const queryParams = useMemo(() => {
		const { sort, page = 1, pagesize = PAGINATION_NUMBER_DEFAULT, ...params } = queryString.parse(locationSearch);

		if (Specialties?.[specialtyIndex]?._id) {
			params.specialtyId = Specialties[specialtyIndex]._id;
		}

		if (WorkingHours?.[workingHourIndex]?._id) {
			params.workingHourId = WorkingHours[workingHourIndex]._id;
		}

		if (!params.startDate) {
			params.startDate = moment().format(DATE_FORMAT);
		}

		if (params.endDate) {
			params.endDate = moment(new Date(params.endDate)).format(DATE_FORMAT);
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

			if (!newQueryParams.search) {
				delete newQueryParams.search;
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
		setQueryParams({ search: str });
	};

	const handleSelectSpecialty = ({ value }) => {
		const index = Specialties.findIndex((specialty) => specialty._id === value);
		if (index > -1) {
			setSpecialtyIndex(index);
		}
	};

	const handleSelectWorkingHour = ({ value }) => {
		const index = WorkingHours.findIndex((workingHour) => workingHour._id === value);
		if (index > -1) {
			setWorkingHourIndex(index);
		}
	};

	const handleSelectRangeDates = (dates) => {
		const [start, end] = dates;
		const startDate = start ? moment(start, DATE_FORMAT) : moment();
		const endDate = end ? moment(end, DATE_FORMAT) : null;
		const isSameDate = endDate && endDate.isSame(startDate);

		setQueryParams({
			startDate: startDate.format(DATE_FORMAT),
			endDate: !isSameDate && endDate ? endDate.format(DATE_FORMAT) : '',
		});
	};

	useEffect(() => {
		setQueryParams(queryParams);
	}, [queryParams, setQueryParams]);

	useEffect(() => {
		tryCatch(async () => {
			if (Specialties.length) {
				const { metadata } = await bookingApi.queryByParameters({ ...queryParams });
				setBookings(metadata.data.map((data) => ({ ...data })));
				setTotalPages(metadata.meta.totalPages);
			}
		})();
	}, [queryParams, Specialties]);

	useEffect(() => {
		if (queryParams.page > totalPages) {
			setQueryParams({ page: 1 });
		}
	}, [totalPages, queryParams, setQueryParams]);

	return {
		Specialties,
		WorkingHours,
		Genders,
		Bookings: bookings,
		currentIndex,
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
