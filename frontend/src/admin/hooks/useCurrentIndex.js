import { useRef } from 'react';

export const useCurrentIndex = (defaultIndex = -1) => {
	const currentIndexRef = useRef(defaultIndex);

	const setCurrentIndex = (rawIndex) => {
		const newIndex = rawIndex < 0 ? 0 : rawIndex;
		if (newIndex !== currentIndexRef.current) {
			currentIndexRef.current = newIndex;
		}
	};

	return { currentIndexRef, setCurrentIndex };
};
