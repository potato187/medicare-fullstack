import { useRef } from 'react';

export const useIndex = (defaultIndex) => {
	const indexRef = useRef(defaultIndex);

	const setIndex = (index) => {
		indexRef.current = index;
	};

	return { index: indexRef.current, setIndex };
};
