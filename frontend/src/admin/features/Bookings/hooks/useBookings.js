import { bookingApi, resourceApi } from 'admin/api';
import { BOOKING_STATUS, DATE_FORMAT, ORDER_NONE, PAGINATION_NUMBER_DEFAULT } from 'admin/constant';
import { useIndex } from 'admin/hooks';
import { createURL, mapData, tryCatch } from 'admin/utilities';
import produce from 'immer';
import moment from 'moment';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { typeOf } from 'utils';

export const useBookings = ({ languageId = 'en' }) => {
	const isLoading = useRef(true);
	const [bookings, setBookings] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const { index: bookingIndex, setIndex: setBookingIndex } = useIndex();
	const { pathname: locationPathName, search: locationSearch } = useLocation();
	const navigate = useNavigate();

	const [data, setData] = useState({
		Specialties: [],
		Genders: [],
		WorkingHours: [],
	});

	const Specialties = useMemo(() => {
		return mapData(data.Specialties, languageId);
	}, [languageId, data]);

	const Genders = useMemo(() => {
		return mapData(data.Genders, languageId);
	}, [languageId, data]);

	const WorkingHours = useMemo(() => {
		return data.WorkingHours.map(({ _id, name }) => ({ value: _id, label: name[languageId] }));
	}, [languageId, data]);

	const Statuses = BOOKING_STATUS.map((status) => ({ ...status, label: status.label[languageId] }));
	const StatusLabels = BOOKING_STATUS.reduce((obj, { value, label }) => {
		obj[value] = label[languageId];
		return obj;
	}, {});

	const queryParams = useMemo(() => {
		const { sort, page = 1, pagesize = PAGINATION_NUMBER_DEFAULT, ...params } = queryString.parse(locationSearch);

		if (!params.specialtyId && Specialties.length) {
			params.specialtyId = Specialties[0].value;
		}

		if (!params.workingHourId && WorkingHours.length) {
			params.workingHourId = WorkingHours[0].value;
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
	}, [locationSearch, Specialties, WorkingHours]);

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

	const handleChangeSort = (key, direction) => {
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

	const handlePageChange = ({ selected }) => {
		setQueryParams({ page: selected + 1 });
	};

	const handleSelect = ({ key, value }) => {
		setQueryParams({ [key]: value });
	};

	const handleChangeSearch = (str) => {
		setQueryParams({ search: str });
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
		let idTimer = null;
		isLoading.current = true;
		tryCatch(async () => {
			if (Specialties.length) {
				const { metadata } = await bookingApi.queryByParameters({ ...queryParams });
				setTotalPages(metadata.meta.totalPages);
				idTimer = setTimeout(() => {
					isLoading.current = false;
					setBookings(metadata.data.map((data) => ({ ...data })));
				}, 500);
			}
		})();

		return () => {
			if (idTimer) {
				clearTimeout(idTimer);
			}
		};
	}, [queryParams, Specialties]);

	useEffect(() => {
		if (queryParams.page > totalPages) {
			setQueryParams({ page: 1 });
		}
	}, [totalPages, queryParams, setQueryParams]);

	useEffect(() => {
		tryCatch(async () => {
			const promises = [
				resourceApi.getAll({ model: 'specialty' }),
				resourceApi.getAll({ model: 'gender' }),
				resourceApi.getAll({ model: 'workingHour' }),
			];
			const response = await Promise.allSettled(promises);
			const [Specialties, Genders, WorkingHours] = response.map((res) =>
				res.status === 'fulfilled' ? res.value.metadata : [],
			);
			setData(
				produce((draft) => {
					draft.Specialties = Specialties;
					draft.Genders = Genders;
					draft.WorkingHours = WorkingHours;
				}),
			);
		})();
	}, []);

	return {
		Specialties,
		WorkingHours,
		Genders,
		Bookings: bookings,
		bookingIndex,
		Statuses,
		StatusLabels,
		queryParams,
		totalPages,
		isLoading: isLoading.current,
		setBookingIndex,
		handleSelectRangeDates,
		setBookings,
		handleSelect,
		handlePageChange,
		handleChangeSort,
		handleChangeSearch,
	};
};
