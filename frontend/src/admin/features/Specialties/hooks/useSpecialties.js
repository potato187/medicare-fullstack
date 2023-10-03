import { doctorApi, resourceApi } from 'admin/api';
import { ORDER_NONE, PAGINATION_NUMBER_DEFAULT } from 'admin/constant';
import { createURL, tryCatch } from 'admin/utilities';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { typeOf } from 'utils';

const mapData = (data, languageId) => {
	return data.map(({ _id, name }) => ({ label: name[languageId], value: _id }));
};

export const useSpecialties = (languageId = 'en') => {
	const [totalPages, setTotalPages] = useState(1);
	const isLoading = useRef(true);
	const [doctors, setDoctors] = useState([]);
	const [specialtyIndex, setSpecialtyIndex] = useState(0);
	const [specialtyData, setSpecialtyData] = useState([]);
	const [positionData, setPositionData] = useState([]);
	const [genderData, setGenderData] = useState([]);

	const Specialties = useMemo(() => {
		return mapData(specialtyData, languageId);
	}, [languageId, specialtyData]);

	const Positions = useMemo(() => {
		return positionData.map(({ key, name }) => ({ label: name[languageId], value: key }));
	}, [languageId, positionData]);

	const PositionLabels = positionData.reduce((obj, { key, name }) => {
		obj[key] = name[languageId];
		return obj;
	}, {});

	const Genders = useMemo(() => {
		return genderData.map(({ key, name }) => ({ label: name[languageId], value: key }));
	}, [languageId, genderData]);

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

	const handleSelectSpecialty = ({ value }) => {
		const index = Specialties.findIndex((specialty) => specialty.value === value);
		setSpecialtyIndex(index);
	};

	useEffect(() => {
		setQueryParams(queryParams);
	}, [queryParams, setQueryParams]);

	useEffect(() => {
		let idTimer = null;
		tryCatch(async () => {
			isLoading.current = true;
			const { metadata } = await doctorApi.queryByParameters(queryParams);
			setTotalPages(metadata.meta.totalPages);
			idTimer = setTimeout(() => {
				setDoctors(metadata.data.map((data) => ({ ...data, isSelected: false })));
				isLoading.current = false;
			}, 500);
		})();

		return () => {
			if (idTimer) {
				clearTimeout(idTimer);
			}
		};
	}, [queryParams]);

	useEffect(() => {
		tryCatch(async () => {
			const promises = [
				resourceApi.getAll({
					model: 'specialty',
				}),
				resourceApi.getAll({
					model: 'position',
				}),
				resourceApi.getAll({
					model: 'gender',
				}),
			];

			const response = await Promise.allSettled(promises);
			const [specialties, positions, genders] = response.map((response) => {
				return response.status === 'fulfilled' ? response.value.metadata : [];
			});

			if (specialties.length) {
				setSpecialtyData(specialties);
			}
			if (positions.length) {
				setPositionData(positions);
			}
			if (genders.length) {
				setGenderData(genders);
			}
		})();
	}, []);

	return {
		Specialties,
		Positions,
		PositionLabels,
		Doctors: doctors,
		Genders,
		totalPages,
		queryParams,
		isLoading: isLoading.current,
		setDoctors,
		handleSelect,
		handlePageChange,
		handleChangeSort,
		handleChangeSearch,
		handleSelectSpecialty,
	};
};
