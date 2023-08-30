import { doctorApi } from 'admin/api';
import { ORDER_NONE, PAGINATION_NUMBER_DEFAULT } from 'admin/constant';
import { createURL, tryCatch } from 'admin/utilities';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { typeOf } from 'utils';
import { useFetchResource } from './useFetchResource';

export const useManageSpecialties = (languageId = 'en') => {
	const Specialties = useFetchResource({
		endpoint: 'specialty',
		languageId,
	});

	const Positions = useFetchResource({
		endpoint: 'position',
		languageId,
		formatter: (positions) =>
			positions.reduce((obj, { key, name }) => {
				obj[key] = name[languageId];
				return obj;
			}, {}),
	});

	const [doctors, setDoctors] = useState([]);
	const [specialtyIndex, setSpecialtyIndex] = useState(0);
	const [totalPages, setTotalPages] = useState(1);

	const { pathname: locationPathName, search: locationSearch } = useLocation();
	const navigate = useNavigate();

	const queryParams = useMemo(() => {
		const { sort, page = 1, pagesize = PAGINATION_NUMBER_DEFAULT, ...params } = queryString.parse(locationSearch);

		if (Specialties?.[specialtyIndex]?.value) {
			params.specialtyId = Specialties[specialtyIndex].value;
		}

		return {
			...params,
			sort: sort || [],
			page,
			pagesize,
		};
	}, [locationSearch, Specialties, specialtyIndex]);

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

	const handleOnSelect = ({ value }) => {
		const index = Specialties.findIndex((item) => item.value === value);
		setSpecialtyIndex(index);
	};

	const handleOnChangeSearch = (str) => {
		setQueryParams({ key_search: str });
	};

	useEffect(() => {
		setQueryParams(queryParams);
	}, [queryParams, setQueryParams]);

	useEffect(() => {
		tryCatch(async () => {
			if (Specialties.length) {
				const { metadata } = await doctorApi.queryByParameters(queryParams);
				setDoctors(metadata.data);
				setTotalPages(metadata.meta.totalPages);
			}
		})();
	}, [queryParams, Specialties]);

	return {
		Specialties,
		Doctors: doctors,
		Positions,
		totalPages,
		queryParams,
		handleOnSelect,
		handleOnPageChange,
		handleOnChangeSort,
		handleOnChangeSearch,
	};
};
