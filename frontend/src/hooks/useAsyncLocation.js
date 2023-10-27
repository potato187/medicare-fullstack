/* eslint-disable */
import queryString from 'query-string';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ORDER_NONE, PAGESIZE_DEFAULT, PAGESIZE_MAX, PAGINATION_NUMBER_DEFAULT } from 'constant';
import { tryCatch, createURL, clampPageSize, clampPage } from 'utils';
import { typeOf } from 'utils/repos';

export const useAsyncLocation = ({ fetch = () => [], parameters = {} }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const navigate = useNavigate();
	const { pathname: locationPathName, search: locationSearch } = useLocation();

	const queryParams = useMemo(() => {
		const { sort, ...params } = queryString.parse(locationSearch);

		params.page = clampPage(params.page);
		params.pagesize = clampPageSize(params.pagesize);

		return {
			...parameters,
			...params,
			sort: sort || [],
		};
	}, [locationSearch]);

	const setQueryParams = (newParams) => {
		const newQueryParams = { ...queryParams, ...newParams };

		if (!newQueryParams.search) {
			delete newQueryParams.search;
		}

		const newUrl = createURL({ url: locationPathName, query: newQueryParams });
		navigate(newUrl);
	};

	const handleChangeSearch = (str) => {
		setQueryParams({ search: str });
	};

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

	useEffect(() => {
		setQueryParams(queryParams);
	}, []);

	useEffect(() => {
		let idTimer = null;

		tryCatch(async () => {
			setIsLoading(true);
			const { metadata } = await fetch(queryParams);
			setTotalPages(metadata.meta.totalPages);
			setData(metadata.data);

			idTimer = setTimeout(() => {
				setIsLoading(false);
			}, 500);
		})();

		return () => {
			if (idTimer) {
				clearTimeout(idTimer);
			}
		};
	}, [queryParams]);

	return {
		data,
		isLoading,
		queryParams,
		totalPages,
		setData,
		setQueryParams,
		handleSelect,
		handleChangeSearch,
		handleChangeSort,
		handlePageChange,
	};
};
