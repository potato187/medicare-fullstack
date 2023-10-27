import { useCallback, useState } from 'react';
import { typeOf } from 'utils/repos';

export const useToggle = (initialState = false) => {
	const [isOpen, setIsOpen] = useState(initialState);

	const toggle = useCallback((newState) => {
		typeOf(newState) === 'boolean' ? setIsOpen(newState) : setIsOpen((prevState) => !prevState);
	}, []);

	return [isOpen, toggle];
};
