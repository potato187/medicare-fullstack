/* eslint-disable */
import queryString from 'query-string';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ORDER_NONE, PAGINATION_NUMBER_DEFAULT } from 'admin/constant';
import { tryCatch } from 'admin/utilities';
import { typeOf } from 'utils';
import { createURL } from '../utilities';

export const useAsyncLocation = ({
	getData = () => {
		return [];
	},
}) => {
	const { pathname: locationPathName, search: locationSearch } = useLocation();
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [totalPages, setTotalPages] = useState(1);

	const queryParams = useMemo(() => {
		const { sort, page = 1, pagesize = PAGINATION_NUMBER_DEFAULT, ...params } = queryString.parse(locationSearch);

		return {
			...params,
			sort: sort || [],
			page,
			pagesize,
		};
	}, [locationSearch]);

	const setQueryParams = (newParams) => {
		const newQueryParams = { ...queryParams, ...newParams };

		if (!newQueryParams.key_search) {
			delete newQueryParams.key_search;
		}

		const newUrl = createURL({ url: locationPathName, query: newQueryParams });
		navigate(newUrl);
	};

	const handleOnChangeSearch = (str) => {
		setQueryParams({ key_search: str });
	};

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

	useEffect(() => {
		setQueryParams(queryParams);
	}, []);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await getData(queryParams);
			setData(metadata.data);
			setTotalPages(metadata.meta.totalPages);
		})();
	}, [queryParams]);

	return {
		data,
		queryParams,
		totalPages,
		setData,
		setQueryParams,
		handleOnSelect,
		handleOnChangeSearch,
		handleOnChangeSort,
		handleOnPageChange,
	};
};
