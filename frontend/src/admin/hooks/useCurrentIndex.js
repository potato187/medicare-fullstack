import { useRef } from 'react';

export const useCurrentIndex = (defaultIndex = -1) => {
	const currentIndexRef = useRef(defaultIndex);

	const setCurrentIndex = (rawIndex) => {
		if (rawIndex !== currentIndexRef.current) {
			currentIndexRef.current = rawIndex;
		}
	};

	return { currentIndexRef, setCurrentIndex };
};
