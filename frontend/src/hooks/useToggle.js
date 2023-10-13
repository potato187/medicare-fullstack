import { useCallback, useState } from 'react';
import { typeOf } from 'utils/repos';

export const useToggle = (initialState = false) => {
	const [isOpen, setIsOpen] = useState(initialState);

	const toggle = useCallback((newState) => {
		if (typeOf(newState) === 'boolean') {
			setIsOpen(newState);
		} else {
			setIsOpen((prevState) => {
				return !prevState;
			});
		}
	}, []);

	return [isOpen, toggle];
};
