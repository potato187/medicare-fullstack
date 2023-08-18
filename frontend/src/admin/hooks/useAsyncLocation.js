import { ORDER_NONE, PAGINATION_NUMBER_DEFAULT } from '@/admin/constant';
import { tryCatch } from '@/shared/utils';
import { typeOf } from '@/utils';
import queryString from 'query-string';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createURL } from '../utilities';

export const useAsyncLocation = ({ fetchFnc = () => null }) => {
	const { pathname: locationPathName, search: locationSearch } = useLocation();
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [totalPages, setTotalPages] = useState(1);

	const queryParams = useMemo(() => {
		const { order = [], ...params } = queryString.parse(locationSearch);

		return {
			...params,
			order: order.length ? order : [],
			page: +params.page || 1,
			per_page: +params.per_page || PAGINATION_NUMBER_DEFAULT,
			totalPages: totalPages,
		};
	}, [locationSearch]);

	const setQueryParams = (newParams) => {
		const newQueryParams = { ...queryParams, ...newParams };

		if (!newQueryParams.search) {
			delete newQueryParams.search;
			delete newQueryParams.search_by;
		}
		navigate(createURL({ url: locationPathName, query: newQueryParams }));
	};

	const handleOnChangeSearch = (str) => {
		setQueryParams({ search: str });
	};

	const handleOnOrder = (key, direction) => {
		const orderItem = `${key},${direction}`;
		const orderList = typeOf(queryParams.order) === 'string' ? [queryParams.order] : queryParams.order;

		const orderItemIndex = orderList.findIndex((item) => item.includes(key));

		if (orderItemIndex > -1) {
			direction !== ORDER_NONE ? orderList.splice(orderItemIndex, 1, orderItem) : orderList.splice(orderItemIndex, 1);
		} else {
			orderList.push(orderItem);
		}

		setQueryParams({ order: orderList });
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
			const metadata = await fetchFnc(queryParams);
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
		handleOnOrder,
		handleOnPageChange,
	};
};
