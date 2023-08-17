import { useCallback, useState } from 'react';

export const useToggle = (initialState = false) => {
	const [isOpen, setIsOpen] = useState(initialState);

	const toggle = useCallback((newState) => {
		typeof newState === 'boolean' ? setIsOpen(newState) : setIsOpen((prevState) => !prevState);
	}, []);

	return [isOpen, toggle];
};
